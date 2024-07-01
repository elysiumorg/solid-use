import { isClient } from '@/utils/helpers';
import {
  createEffect,
  createSignal,
  onCleanup,
  type Accessor,
  type Setter,
} from 'solid-js';

type UseStorageOptions<Value> = {
  serializer?: (value: Value) => string;
  deserializer?: (value: string) => Value;
  initialValue?: Value | (() => Value);
};

const IS_SERVER = typeof window === 'undefined';

type UseStorageReturn<Value> = [Accessor<Value>, Setter<Value>, () => void];

/**
 * @name useStorage
 * @description - Hook that returns the previous value of a given state.
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Accessor<Value>} value The accessor function for the current value
 * @returns {Accessor<Value | undefined>} The accessor function for the previous value
 *
 * @example
 * const [value, setValue] = createSignal(0);
 * const prevValue = usePrevious(value);
 */
export function useStorage<Value>(
  key: string,
): UseStorageReturn<Value | undefined>;
export function useStorage<Value>(
  key: string,
  options: UseStorageOptions<Value> & { initialValue: Value | (() => Value) },
): UseStorageReturn<Value>;
export function useStorage<Value>(
  key: string,
  options?: UseStorageOptions<Value>,
): UseStorageReturn<Value | undefined>;
export function useStorage<Value>(
  key: string,
  options: UseStorageOptions<Value> = {},
) {
  const { initialValue } = options;

  const serializer = (value: Value) => {
    if (options.serializer) {
      return options.serializer(value);
    }

    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    // Support 'undefined' as a value
    if (value === 'undefined') {
      return undefined as unknown as Value;
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue; // Return initialValue if parsing fails
    }

    return parsed as Value;
  };

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Prevent build error "window is undefined" but keep working
    if (!isClient) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValueToUse;
    }
  };

  const [storedValue, setStoredValue] = createSignal<Value | undefined>(
    readValue(),
  );

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (
    value: Value | ((prevValue: Value | undefined) => Value),
  ) => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`,
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value;

      // Save to local storage
      window.localStorage.setItem(key, serializer(newValue));

      // Save state
      setStoredValue(() => newValue);

      // We dispatch a custom event so every similar useLocalStorage hook is notified
      window.dispatchEvent(new StorageEvent('local-storage', { key }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const removeValue = () => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key “${key}” even though environment is not a client`,
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Remove the key from local storage
    window.localStorage.removeItem(key);

    // Save state with default value
    setStoredValue(() => defaultValue);

    // We dispatch a custom event so every similar useLocalStorage hook is notified
    window.dispatchEvent(new StorageEvent('local-storage', { key }));
  };

  createEffect(() => {
    setStoredValue(() => readValue());
  });

  const handleStorageChange = (event: StorageEvent | CustomEvent) => {
    if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
      return;
    }
    setStoredValue(() => readValue());
  };

  window.addEventListener('storage', handleStorageChange);
  onCleanup(() => {
    window.removeEventListener('storage', handleStorageChange);
  });

  return [storedValue, setValue, removeValue];
}
