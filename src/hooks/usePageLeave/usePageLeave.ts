import { createSignal } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 * @category Sensors
 *
 * @param {() => void} [callback] The callback function what calls then mouse leaves the page
 * @returns {boolean} A boolean which determines if the mouse left the page
 *
 * @example
 * const isLeft = usePageLeave(() => console.log('on leave'))
 */
export const usePageLeave = (callback?: () => void) => {
  const [isLeft, setIsLeft] = createSignal(false);

  const onMouse = () => {
    if (isLeft()) return setIsLeft(false);
    callback?.();
    setIsLeft(true);
  };

  useEventListener(document, 'mouseleave', onMouse, { passive: true });
  useEventListener(document, 'mouseenter', onMouse, { passive: true });

  return isLeft;
};
