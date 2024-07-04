import { createSignal, onCleanup, type Accessor, type Setter } from 'solid-js';

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
  count: Accessor<number>;
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
export const useCounter: UseCounter = (
  initialValue: number = 0,
  options: UseCounterOptions = {},
) => {
  const [count, setCount] = createSignal(initialValue);
  const max = options.max ?? Number.POSITIVE_INFINITY;
  const min = options.min ?? Number.NEGATIVE_INFINITY;
  let interval: NodeJS.Timeout;

  const setCountWithinBounds = (value: number) => {
    setCount(Math.max(min, Math.min(max, value)));
  };

  const setCountDelayed = (target: number) => {
    const direction = target > count() ? 1 : -1;

    interval = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + direction;
        if (
          (direction === 1 && nextCount >= target) ||
          (direction === -1 && nextCount <= target)
        ) {
          clearInterval(interval);
          return target;
        }
        return nextCount;
      });
    }, options.delay);
  };

  const inc = (value: number = 1) => {
    clearInterval(interval);
    const currentTarget = count();
    const newTarget = currentTarget + value;
    if (options.delay) {
      setCountDelayed(Math.min(max, newTarget));
    } else {
      setCountWithinBounds(newTarget);
    }
  };

  const dec = (value: number = 1) => {
    clearInterval(interval);
    const currentTarget = count();
    const newTarget = currentTarget - value;
    if (options.delay) {
      setCountDelayed(Math.max(min, newTarget));
    } else {
      setCountWithinBounds(newTarget);
    }
  };

  const reset = () => {
    setCountWithinBounds(initialValue);
  };

  const set = (value: number | ((prevCount: number) => number)) => {
    clearInterval(interval);
    if (typeof value === 'number') {
      setCountWithinBounds(value);
    } else {
      setCount(prevCount => {
        return Math.max(min, Math.min(max, value(prevCount)));
      });
    }
  };

  onCleanup(() => {
    clearInterval(interval);
  });

  return { count, set, inc, dec, reset } as const;
};
