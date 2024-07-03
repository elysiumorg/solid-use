import { createEffect, createSignal, type Accessor } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

//* The use hover options type */
export interface UseHoverOptions {
  //* The on entry callback */
  onEntry?: () => void;
  //* The on leave callback */
  onLeave?: () => void;
}

//* The use hover return type */
export type UseHoverReturn = {
  ref: () => void;
  isHover: Accessor<boolean>;
};

export type UseHover = {
  (options?: UseHoverOptions): UseHoverReturn;
};

/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 * @category Sensors
 *
 * @template Target The target element
 * @param {() => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {() => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {UseHoverReturn} The state of the hover
 *
 * @example
 * const { ref, isHover } = useHover({
 *   onEntry: () => console.log('onEntry'),
 *   onLeave: () => console.log('onLeave'),
 * });
 */
export const useHover = ((options: UseHoverOptions) => {
  const [hovering, setHovering] = createSignal(false);
  let internalRef: Element | null = null;

  const refCallback = (ref: Element | null) => {
    if (!ref) return;
    internalRef = ref;
  };

  const onMouseEnter = () => {
    options?.onEntry?.();
    setHovering(true);
  };

  const onMouseLeave = () => {
    options?.onLeave?.();
    setHovering(false);
  };

  createEffect(() => {
    if (internalRef) {
      useEventListener(internalRef, 'mouseenter', onMouseEnter);
      useEventListener(internalRef, 'mouseleave', onMouseLeave);
    }
  });

  return { ref: refCallback, isHover: hovering };
}) as UseHover;
