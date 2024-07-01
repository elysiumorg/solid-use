import { type Accessor, createEffect, createSignal } from 'solid-js';
import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';
import { usePrevious } from '../usePrevious/usePrevious';

/**
 * @name useDebounceValue
 * @description - Hook that creates a debounced value and returns a stable reference of it
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to be debounced
 * @param {number} delay The delay in milliseconds
 * @returns {Value} The debounced value
 *
 * @example
 * const debouncedValue = useDebounceValue(value, 500);
 */
export const useDebounceValue = <Value>(
  value: Accessor<Value>,
  delay: number,
) => {
  const previousValueRef = usePrevious(value);
  const [debouncedValue, setDebounceValue] = createSignal(value());

  const debouncedSetState = useDebounceCallback(setDebounceValue, delay);

  createEffect(() => {
    if (previousValueRef() === value()) return;
    debouncedSetState(() => value());
  });

  return debouncedValue;
};
