import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

/** The use interval options */
export interface UseIntervalOptions {
  /** Start the interval immediately */
  enabled?: boolean;
}

/** The use interval return type */
export interface UseIntervalReturn {
  /** Is the interval active */
  isActive: Accessor<boolean>;
  /** Pause the interval */
  pause: () => void;
  /** Resume the interval */
  resume: () => void;
}

/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 *
 * @param {() => void} callback Any callback function
 * @param {number} [interval=1000] Time in milliseconds
 * @param {boolean} [options.enabled=true] Start the interval immediately
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { isActive, pause, resume } = useInterval(() => console.log('inside interval'), 2500);
 */
export const useInterval = (
  callback: () => void,
  interval: number | Accessor<number>,
  options: UseIntervalOptions = {},
): UseIntervalReturn => {
  const enabled = options?.enabled ?? true;

  const [isActive, setIsActive] = createSignal<boolean>(enabled ?? true);

  let intervalIdRef: ReturnType<typeof setInterval>;
  const intervalDelay = () =>
    interval instanceof Function ? interval() : interval;

  createEffect(() => {
    if (!enabled) return;
    clearInterval(intervalIdRef);

    intervalIdRef = setInterval(callback, intervalDelay());
  });

  onCleanup(() => clearInterval(intervalIdRef));

  const pause = () => {
    setIsActive(false);
    clearInterval(intervalIdRef);
  };

  const resume = () => {
    if (intervalDelay() <= 0) return;
    setIsActive(true);
    clearInterval(intervalIdRef);
    intervalIdRef = setInterval(callback, intervalDelay());
  };

  return {
    isActive,
    pause,
    resume,
  };
};
