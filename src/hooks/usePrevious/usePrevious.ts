import { type Accessor, createEffect, createSignal } from 'solid-js';

/**
 * @name usePrevious
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
export function usePrevious<Value>(
  value: Accessor<Value>,
): Accessor<Value | undefined> {
  const [previous, setPrevious] = createSignal<Value>();

  createEffect<Value>(prevValue => {
    setPrevious(() => prevValue);

    return value();
  });

  return previous;
}
