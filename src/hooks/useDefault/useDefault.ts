import { createSignal, type Accessor, type Setter } from 'solid-js';

/**
 * @name useDefault
 * @description - Hook that returns the default value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} initialValue The initial value
 * @param {Value} defaultValue The default value
 * @returns {[Value, (value: Value) => void]} An array containing the current value and a function to set the value
 *
 * @example
 * const [value, setValue] = useDefault(initialValue, defaultValue);
 */
export const useDefault = <Value>(
  initialValue: Value | (() => Value),
  defaultValue: Value,
): [Accessor<Value>, Setter<Value | null | undefined>] => {
  const [value, setValue] = createSignal<Value | null | undefined>(
    initialValue instanceof Function ? initialValue() : initialValue,
  );

  const getValue = (): Value => {
    const currentValue = value();
    return currentValue == null ? defaultValue : currentValue;
  };

  return [getValue, setValue];
};
