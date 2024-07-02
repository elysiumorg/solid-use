import { isClient } from '@/utils/helpers';
import {
  createEffect,
  createSignal,
  onCleanup,
  type Accessor,
  type Setter,
} from 'solid-js';

export type UseStorageOptions<Value> = {
  serializer?: (value: Value) => string;
  deserializer?: (value: string) => Value;
  initialValue?: Value | (() => Value);
};

export type UseStorageReturn<Value> = [
  Accessor<Value>,
  Setter<Value>,
  () => void,
];

export function useStorage<Value>(
  storage: Storage,
  key: string,
): UseStorageReturn<Value | undefined>;
export function useStorage<Value>(
  storage: Storage,
  key: string,
  options: UseStorageOptions<Value> & { initialValue: Value | (() => Value) },
): UseStorageReturn<Value>;
export function useStorage<Value>(
  storage: Storage,
  key: string,
  options?: UseStorageOptions<Value>,
): UseStorageReturn<Value | undefined>;
export function useStorage<Value>(
  storage: Storage,
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
      return defaultValue;
    }

    return parsed as Value;
  };

  const readValue = () => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (!isClient) {
      return initialValueToUse;
    }

    try {
      const raw = storage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValueToUse;
    }
  };

  const [storedValue, setStoredValue] = createSignal<Value | undefined>(
    readValue(),
  );

  const setValue = (
    value: Value | ((prevValue: Value | undefined) => Value),
  ) => {
    if (!isClient) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`,
      );
    }

    try {
      const newValue = value instanceof Function ? value(readValue()) : value;

      storage.setItem(key, serializer(newValue));

      setStoredValue(() => newValue);

      window.dispatchEvent(new StorageEvent('local-storage', { key }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const removeValue = () => {
    if (!isClient) {
      console.warn(
        `Tried removing localStorage key “${key}” even though environment is not a client`,
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    storage.removeItem(key);

    setStoredValue(() => defaultValue);

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
