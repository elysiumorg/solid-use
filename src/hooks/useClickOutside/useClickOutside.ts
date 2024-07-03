import { createEffect, onCleanup } from 'solid-js';

/** The use click outside target element type */
type UseClickOutsideTarget = Element | null | (() => Element);

const getElement = (target: UseClickOutsideTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target;
};

export type UseClickOutside = {
  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    target: Target,
    callback: (event: Event) => void,
  ): void;

  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    callback: (event: Event) => void,
    target?: never,
  ): (ref: Element | null) => Target;
};

/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s)
 * @category Sensors
 *
 * @overload
 * @template Target The target element(s)
 * @param {Target} target The target element(s) to detect outside clicks for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {void}
 *
 * @example
 * useClickOutside(ref, () => console.log('click outside'));
 *
 * @overload
 * @template Target The target element(s)
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {UseClickOutsideReturn<Target>} A React ref to attach to the target element
 *
 * @example
 * const ref = useClickOutside<HMLDiTvElement>(() => console.log('click outside'));
 */
export const useClickOutside = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseClickOutsideTarget
    | UseClickOutsideTarget[]
    | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (
    event: Event,
  ) => void;

  let internalRef: Element | null;

  const refCallback = (ref: Element | null) => {
    if (!ref) return null;
    internalRef = ref;
  };

  createEffect(() => {
    const handler = (event: Event) => {
      if (Array.isArray(target)) {
        if (!target.length) return;

        const isClickedOutsideElements = target.every(target => {
          const element = getElement(target);
          return element && !element.contains(event.target as Node);
        });

        if (isClickedOutsideElements) callback(event);

        return;
      }

      const element = target ? getElement(target) : internalRef;

      if (element && !element.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    onCleanup(() => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    });
  });

  if (target) return;
  return refCallback;
}) as UseClickOutside;
