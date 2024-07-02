import { createMemo, createSignal, type Accessor } from 'solid-js';

/** The use queue return type */
export interface UseQueueReturn<Value> {
  /** The current queue */
  queue: Accessor<Value[]>;
  /** Add an element to the queue */
  add: (element: Value) => void;
  /** Remove an element from the queue */
  remove: () => Value | undefined;
  /** Clear the queue */
  clear: () => void;
  /** Get the first element of the queue */
  first: () => Value | undefined;
  /** Get the last element of the queue */
  last: () => Value | undefined;
  /** Get the size of the queue */
  size: () => number;
}

/**
 * @name useQueue
 * @description - Hook that manages a queue
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [initialValue=[]] The initial value of the queue
 * @returns {UseQueueReturn<Value>} An object containing the current queue and functions to interact with the queue
 *
 * @example
 * const { queue, add, remove, clear, first, last, size } = useQueue([1, 2, 3]);
 */
export const useQueue = <Value>(
  initialValue: Value[] = [],
): UseQueueReturn<Value> => {
  const [queue, setQueue] = createSignal<Value[]>(initialValue);

  const add = (element: Value) => setQueue(q => [...q, element]);
  const clear = () => setQueue([]);
  const remove = () => {
    let removed: Value | undefined;
    setQueue(q => {
      if (q.length === 0) return q;
      [removed] = q;
      return q.slice(1);
    });
    return removed;
  };

  const first = createMemo(() => queue()[0]);
  const last = createMemo(() => queue()[queue().length - 1]);
  const size = createMemo(() => queue().length);

  return {
    add,
    remove,
    clear,
    first,
    last,
    size,
    queue,
  };
};
