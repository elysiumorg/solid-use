import { debounce } from '@/utils/helpers';

/**
 * @name useDebounceCallback
 * @description - Hook that creates a debounced callback and returns a stable reference of it
 * @category Utilities
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with debounce
 *
 * @example
 * const [value, setValue] = createSignal(0);
 * const debouncedSetValue = useDebounceCallback(setValue, 500);
 */
export const useDebounceCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number,
) => {
  const debounced = debounce(callback, delay);

  return debounced;
};
