import { isClient } from '@/utils/helpers';
import type { Connection } from '@/utils/types';
import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

declare global {
  interface Navigator {
    readonly connection: Connection;
    readonly mozConnection: Connection;
    readonly webkitConnection: Connection;
  }
}

/** The type of network connection */
export type ConnectionType = Connection['type'];
/** The effective type of connection */
export type ConnectionEffectiveType = Connection['effectiveType'];

/** The use network return type */
export interface UseNetworkReturn {
  /** Indicates if the device is currently online */
  online: boolean;
  /** The estimated downlink speed in megabits per seconds */
  downlink?: Connection['downlink'];
  /** The maximum downlink speed, if available */
  downlinkMax?: Connection['downlinkMax'];
  /** The effective type of connection (e.g., '2g', '3g', '4g') */
  effectiveType?: Connection['effectiveType'];
  /** The estimated round-trip time in milliseconds */
  rtt?: Connection['rtt'];
  /** Indicates if the user has enabled data saving mode */
  saveData?: Connection['saveData'];
  /** The type of network connection (e.g., 'wifi', 'cellular') */
  type?: Connection['type'];
}

export const getConnection = () =>
  navigator?.connection ||
  navigator?.mozConnection ||
  navigator?.webkitConnection;

/**
 * @name useNetwork
 * @description - Hook to track network status
 * @category Sensors
 *
 * @returns {UseNetworkReturn} An object containing the network status
 *
 * @example
 * const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
 */
export const useNetwork = (): Accessor<UseNetworkReturn> => {
  const getDefaultValue = () => {
    if (!isClient) {
      return {
        online: false,
        type: undefined,
        effectiveType: undefined,
        saveData: false,
        downlink: 0,
        downlinkMax: 0,
        rtt: 0,
      };
    }
    const online = navigator.onLine;
    const connection = getConnection();

    return {
      online,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
    };
  };

  const [value, setValue] = createSignal(getDefaultValue());

  createEffect(() => {
    const callback = () => {
      const online = navigator.onLine;
      const connection = getConnection();

      setValue({
        online,
        downlink: connection?.downlink,
        downlinkMax: connection?.downlinkMax,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
        type: connection?.type,
      });
    };

    useEventListener(window, 'online', callback, { passive: true });
    useEventListener(window, 'offline', callback, { passive: true });

    const connection = getConnection();

    if (connection) {
      connection.addEventListener('change', callback, { passive: true });
    }

    onCleanup(() => {
      if (connection) {
        connection.removeEventListener('change', callback);
      }
    });
  });

  return value;
};
