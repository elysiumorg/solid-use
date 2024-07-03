import { createEffect, createSignal, type Accessor } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use mouse target element type */
type UseMouseTarget = null | (() => Element) | Element;

/** Function to get target element based on its type */
const getElement = (target: UseMouseTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target;
};

/** The use mouse return type */
export interface UseMouseReturn {
  /** The current mouse x position */
  x: number;
  /** The current mouse y position */
  y: number;
  /** The current element x position */
  elementX: number;
  /** The current element y position */
  elementY: number;
  /** The current element position x */
  elementPositionX: number;
  /** The current element position y */
  elementPositionY: number;
}

export type UseMouse = {
  <Target extends UseMouseTarget>(target: Target): Accessor<UseMouseReturn>;

  <Target extends UseMouseTarget>(
    target?: never,
  ): [(ref: Target) => void, Accessor<UseMouseReturn>];
};

/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @returns {UseMouseReturn & { ref: RefObject<Target> }} An object with the current mouse position and a ref
 *
 * @example
 * const [ref, value] = useMouse();
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to manage the mouse position for
 * @returns {UseMouseReturn} An object with the current mouse position
 *
 * @example
 * const value = useMouse(target);
 *
 */
export const useMouse = ((...params: any[]) => {
  const target = params[0] as UseMouseTarget | undefined;

  const [value, setValue] = createSignal<UseMouseReturn>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  });

  let internalRef: Element;

  const refCallback = (ref: Element | null) => {
    if (!ref) return;
    internalRef = ref;
  };

  createEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const element = target ? getElement(target) : internalRef;
      if (!element) return;

      const updatedValue = {
        x: event.pageX,
        y: event.pageY,
      } as UseMouseReturn;

      const { left, top } = element.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;
      const elementX = event.pageX - elementPositionX;
      const elementY = event.pageY - elementPositionY;

      updatedValue.elementX = elementX;
      updatedValue.elementY = elementY;
      updatedValue.elementPositionX = elementPositionX;
      updatedValue.elementPositionY = elementPositionY;

      setValue(prevValue => ({
        ...prevValue,
        ...updatedValue,
      }));
    };

    useEventListener(document, 'mousemove', onMouseMove);
  }, []);

  if (target) return value;
  return [refCallback, value];
}) as UseMouse;
