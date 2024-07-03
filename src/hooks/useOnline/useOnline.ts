import { createSignal } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useOnline
 * @description - Hook that manages if the user is online
 * @category Sensors
 *
 * @returns {Accessor<boolean>} A boolean indicating if the user is online
 *
 * @example
 * const online = useOnline();
 */
export const useOnline = () => {
  const [isOnline, setIsOnline] = createSignal(true);

  useEventListener(window, 'online', () => setIsOnline(true));
  useEventListener(window, 'offline', () => setIsOnline(false));

  return isOnline;
};
