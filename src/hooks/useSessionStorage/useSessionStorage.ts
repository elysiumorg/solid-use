import {
  type UseStorageOptions,
  useStorage,
  type UseStorageReturn,
} from '../useStorage/useStorage';

/**
 * @name useSessionStorage
 * @description - Hook that manages session storage value
 * @category Browser
 *
 * @template Value The type of the value
 * @param {string} key The key of the storage
 * @param {UseStorageOptions<Value>} [options] The options of the storage
 *
 * @example
 * const [value, setValue, removeValue] = useSessionStorage('session-key', {
 *   initialValue: 0,
 * });
 */
export function useSessionStorage<Value>(
  key: string,
): UseStorageReturn<Value | undefined>;
export function useSessionStorage<Value>(
  key: string,
  options: UseStorageOptions<Value> & { initialValue: Value | (() => Value) },
): UseStorageReturn<Value>;
export function useSessionStorage<Value>(
  key: string,
  options?: UseStorageOptions<Value>,
): UseStorageReturn<Value | undefined>;
export function useSessionStorage<Value>(
  key: string,
  options?: UseStorageOptions<Value>,
) {
  return useStorage<Value>(sessionStorage, key, options);
}
