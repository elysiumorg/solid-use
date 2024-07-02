import { type Accessor, createSignal } from 'solid-js';

/** The use set return type */
interface UseSetReturn<Value> {
  /** The current set */
  value: Accessor<Set<Value>>;
  /** The size of the set */
  size: Accessor<number>;
  /** Function to check if a value exists in the set */
  has: (value: Value) => boolean;
  /** Function to add a value to the set */
  add: (value: Value) => void;
  /** Function to remove a value from the set */
  remove: (value: Value) => boolean;
  /** Function to clear the set */
  clear: () => void;
  /** Function to toggle a value in the set */
  reset: () => void;
  /** Function to toggle a value in the set */
  toggle: (value: Value) => void;
  /** Function to get the union of two sets */
  union: (other: Set<Value>) => void;
  /** Function to get the difference of two sets */
  intersection: (other: Set<Value>) => void;
  /** Function to get the symmetric difference of two sets */
  difference: (other: Set<Value>) => void;
  /** Function to get the symmetric difference of two sets */
  symmetricDifference: (other: Set<Value>) => void;
}

/**
 * @name useSet
 * @description - Hook that manages a set structure
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {UseSetReturn<Value>} An object containing the current set and functions to interact with the set
 *
 * @example
 * const { value, add, remove, clear, reset, toggle, union, intersection, difference, symmetricDifference, size, has } = useSet([1, 2, 3]);
 */
export const useSet = <Value>(values?: Value[]): UseSetReturn<Value> => {
  const [set, setSet] = createSignal(new Set(values));

  const add = (value: Value) => setSet(prevSet => new Set(prevSet).add(value));
  const remove = (value: Value) => {
    const result = set().has(value);
    setSet(prevSet => {
      if (!prevSet.has(value)) return prevSet;
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
    return result;
  };
  const clear = () => setSet(new Set<Value>());
  const reset = () => setSet(new Set(values));
  const toggle = (value: Value) =>
    setSet(prevSet => {
      if (!prevSet.has(value)) return new Set(prevSet).add(value);
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const union = (other: Set<Value>) => setSet(set().union(other));
  const difference = (other: Set<Value>) => setSet(set().difference(other));
  const symmetricDifference = (other: Set<Value>) =>
    setSet(set().symmetricDifference(other));
  const intersection = (other: Set<Value>) => setSet(set().intersection(other));
  const has = (value: Value) => set().has(value);

  return {
    value: set,
    size: () => set().size,
    has,
    add,
    remove,
    clear,
    reset,
    toggle,
    union,
    difference,
    symmetricDifference,
    intersection,
  };
};
