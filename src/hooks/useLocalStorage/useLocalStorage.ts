import {
  useStorage,
  type UseStorageOptions,
  type UseStorageReturn,
} from '../useStorage/useStorage';

/**
 * @name useLocalStorage
 * @description - Hook that manages local storage value
 * @category Browser
 *
 * @template Value The type of the value
 * @param {string} key The key of the storage
 * @param {UseStorageOptions<Value>} [options] The options of the storage
 *
 * @example
 * const [value, setValue, removeValue] = useLocalStorage('local-key', {
 *   initialValue: 0,
 * });
 */
export function useLocalStorage<Value>(
  key: string,
): UseStorageReturn<Value | undefined>;
export function useLocalStorage<Value>(
  key: string,
  options: UseStorageOptions<Value> & { initialValue: Value | (() => Value) },
): UseStorageReturn<Value>;
export function useLocalStorage<Value>(
  key: string,
  options?: UseStorageOptions<Value>,
): UseStorageReturn<Value | undefined>;
export function useLocalStorage<Value>(
  key: string,
  options?: UseStorageOptions<Value>,
) {
  return useStorage<Value>(window.localStorage, key, options);
}
