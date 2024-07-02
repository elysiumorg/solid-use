import {
  createEffect,
  createRenderEffect,
  createSignal,
  onCleanup,
  type Accessor,
} from 'solid-js';

/** The use measure target element type */
export type UseMeasureTarget = Element | null | (() => Element);

const getElement = (target: UseMeasureTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target;
};

/** The use measure return type */
export type UseMeasureReturn = {
  rect: Accessor<{
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>;
};

export type UseMeasureScreen = {
  <Target extends UseMeasureTarget>(target: Target): UseMeasureReturn;

  <Target extends UseMeasureTarget>(
    target?: never,
  ): UseMeasureReturn & { ref: Target };
};

/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 *
 * @overload
 * @template Target The element to measure
 * @param {Target} [target] The element to measure
 * @returns {UseMeasureReturn} The element's size and position
 *
 * @example
 * const { x, y, width, height, top, left, bottom, right } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @returns {UseMeasureReturn & { ref: RefObject<Target> }} The element's size and position
 *
 * @example
 * const { ref, x, y, width, height, top, left, bottom, right } = useMeasure();
 */
export const useMeasure = (<Target extends UseMeasureTarget>(
  target?: Target,
) => {
  let internalRef: Element | null = null;
  const [rect, setRect] = createSignal({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const refCallback = (ref: Element) => {
    if (!ref) return;
    internalRef = ref;
  };

  createEffect(() => {
    const element = target ? getElement(target) : internalRef;

    if (!element) return;

    const observer = new window.ResizeObserver(([entry]) => {
      if (!entry) return;

      const { x, y, width, height, top, left, bottom, right } =
        entry.contentRect;
      setRect({ x, y, width, height, top, left, bottom, right });
    });
    observer.observe(element);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  if (target) return rect;
  return { ref: refCallback, rect };
}) as UseMeasureScreen;
