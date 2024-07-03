import { createSignal, onCleanup, type Accessor } from 'solid-js';

/** The use timeout return type */
interface UseTimeoutReturn {
  /**  Timeout is ready state value */
  ready: Accessor<boolean>;
  /** Function to clear timeout */
  clear: () => void;
}

/**
 * @name useTimeout
 * @description - Hook that executes a callback function after a specified delay
 * @category Time
 *
 * @param {() => void} callback The function to be executed after the timeout
 * @param {number} delay The delay in milliseconds before the timeout executes the callback function
 * @returns {UseTimeoutReturn} An object with a `ready` boolean state value and a `clear` function to clear timeout
 *
 * @example
 * const timeout = useTimeout(() => {}, 5000);
 */
export function useTimeout(
  callback: () => void,
  delay: number,
): UseTimeoutReturn {
  const [ready, setReady] = createSignal(false);

  const timeoutId = setTimeout(() => {
    callback();
    setReady(true);
  }, delay);

  onCleanup(() => {
    clearTimeout(timeoutId);
  });

  const clear = () => {
    clearTimeout(timeoutId);
    setReady(true);
  };

  return { ready, clear };
}
