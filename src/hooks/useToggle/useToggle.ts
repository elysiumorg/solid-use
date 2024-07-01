import { type Accessor, createSignal } from 'solid-js';

/** The use toggle return type */
export type UseToggleReturn<Value> = readonly [
  Accessor<Value>,
  (value?: Value) => void,
];

/**
 * @name useToggle
 * @description - Hook that creates a toggle
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The values to toggle
 *
 * @example
 * const [on, toggle] = useToggle();
 *
 * @example
 * const [value, toggle] = useToggle(['light', 'dark'] as const);
 */
export const useToggle = <Value>(values: readonly Value[]) => {
  const [option, setOption] = createSignal<Value>(values[0]);

  const toggle = (value?: Value) => {
    if (value) {
      setOption(() => value);
    } else {
      const currentIndex = values.indexOf(option());
      const nextIndex = (currentIndex + 1) % values.length;
      setOption(() => values[nextIndex]);
    }
  };

  return [option, toggle] as UseToggleReturn<Value>;
};
