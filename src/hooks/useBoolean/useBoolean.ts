import { type Accessor, createSignal } from 'solid-js';

/** The use boolean return type */
type UseBooleanReturn = [
  /** The current boolean state value */
  value: Accessor<boolean>,
  /** Function to toggle the boolean state */
  toggle: (value?: boolean) => void,
];

/**
 * @name useBoolean
 * @description - Hook provides a boolean state and a function to toggle the boolean value
 * @category Utilities
 *
 * @param {boolean} [initialValue=false] The initial boolean value
 * @returns {UseBooleanReturn} An array containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const [on, toggle] = useBoolean()
 */
export const useBoolean = (initialValue: boolean = false): UseBooleanReturn => {
  const [value, setValue] = createSignal(initialValue);
  const toggle = (value?: boolean) =>
    setValue(prevValue => value ?? !prevValue);

  return [value, toggle];
};
