import { createSignal, type Setter } from 'solid-js';

/** The use counter options */
export interface UseCounterOptions {
  /** The min of count value */
  min?: number;
  /** The max of count value */
  max?: number;
  delay?: number;
}

/** The use counter return type */
export interface UseCounterReturn {
  /** The current count value */
  count: number;
  /** Function to set a specific value to the counter */
  set: Setter<number>;
  /** Function to reset the counter to its initial value. */
  reset: () => void;
  /** Function to increment the counter */
  inc: (value?: number) => void;
  /** Function to decrement the counter */
  dec: (value?: number) => void;
}

export type UseCounter = {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;
};

/**
 * @name useCounter
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 * @category Utilities
 *
 * @param {number} [initialValue=0] The initial number value
 * @param {number} [options.min=Number.NEGATIVE_INFINITY] The min of count value
 * @param {number} [options.max=Number.POSITIVE_INFINITY] The max of count value
 * @param {number} [options.delay] The delay in milliseconds for smooth increment and decrement
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5, { min: 0, max: 10 });
 */
export const useCounter = (
  initialValue: number = 0,
  options: UseCounterOptions = {},
) => {
  const [count, setCount] = createSignal(initialValue ?? 0);
  const max = options.max ?? Number.POSITIVE_INFINITY;
  const min = options.min ?? Number.NEGATIVE_INFINITY;
  let interval: NodeJS.Timeout;

  const setCountDelayed = (value: number) => {
    const remaining = value + count();

    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      setCount(prevCount => prevCount + (value < 0 ? -1 : 1));

      if (count() === remaining) clearInterval(interval);
    }, options.delay);
  };
  const inc = (value: number = 1) => {
    const result = Math.max(Math.min(max, count() + value), min);

    if (options.delay) {
      return setCountDelayed(result);
    }

    setCount(result);
  };

  const dec = (value: number = 1) => {
    const result = Math.min(Math.max(min, count() - value), max);

    if (options.delay) {
      return setCountDelayed(-value);
    }

    setCount(prevCount => {
      if (typeof min === 'number' && prevCount === min) return prevCount;
      return result;
    });
  };

  const reset = () => {
    const value = initialValue ?? 0;
    if (typeof max === 'number' && value > max) return setCount(max);
    if (typeof min === 'number' && value < min) return setCount(min);
    setCount(value);
  };

  const set = (value: number | ((prevCount: number) => number)) => {
    clearInterval(interval);

    setCount(prevCount =>
      Math.max(
        min,
        Math.min(max, typeof value === 'number' ? value : value(prevCount)),
      ),
    );
  };

  return { count, set, inc, dec, reset } as const;
};
