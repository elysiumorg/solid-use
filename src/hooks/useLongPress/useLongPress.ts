import { createEffect, createSignal, type Accessor } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

// * The use long press options type */
interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press start
  onStart?: (event: Event) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: Event) => void;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: Event) => void;
}

// * The use long press return type */
export type UseLongPressReturn = [
  (ref: Element | null) => void,
  Accessor<boolean>,
];

export type UseLongPress = {
  (
    callback: (event: Event) => void,
    options?: UseLongPressOptions,
  ): UseLongPressReturn;
};

const DEFAULT_THRESHOLD_TIME = 400;

/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be long pressed
 * @param {(event: Event) => void} callback The callback function to be invoked on long press
 * @param {number} [options.threshold=400] The threshold time in milliseconds
 * @param {(event: Event) => void} [options.onStart] The callback function to be invoked on long press start
 * @param {(event: Event) => void} [options.onFinish] The callback function to be invoked on long press finish
 * @param {(event: Event) => void} [options.onCancel] The callback function to be invoked on long press cancel
 * @returns {UseLongPressReturn<Target>} The ref of the target element
 *
 * @example
 * const [ref, longPressing] = useLongPress(() => console.log('callback'));
 */
export const useLongPress = ((...params: any[]) => {
  const target = (
    params[0] instanceof Function || !('current' in params[0])
      ? undefined
      : params[0]
  ) as Element | undefined;
  const callback = (target ? params[1] : params[0]) as (event: Event) => void;
  const options = (target ? params[2] : params[1]) as
    | UseLongPressOptions
    | undefined;

  const [isLongPressActive, setIsLongPressActive] = createSignal(false);
  let internalRef: Element | null = null;
  let timeoutId: ReturnType<typeof setTimeout>;
  let isPressed = false;

  const refCallback = (ref: Element | null) => {
    if (!ref) return;
    internalRef = ref;
  };

  const start = (event: Event) => {
    options?.onStart?.(event);

    isPressed = true;
    timeoutId = setTimeout(() => {
      callback(event);
      setIsLongPressActive(true);
    }, options?.threshold ?? DEFAULT_THRESHOLD_TIME);
  };

  const cancel = (event: Event) => {
    if (isLongPressActive()) {
      options?.onFinish?.(event);
    } else if (isPressed) {
      options?.onCancel?.(event);
    }

    setIsLongPressActive(false);
    isPressed = false;

    if (timeoutId) clearTimeout(timeoutId);
  };

  createEffect(() => {
    if (internalRef) {
      useEventListener(target ?? internalRef, 'mousedown', start);
      useEventListener(target ?? internalRef, 'touchstart', start);
      useEventListener(target ?? internalRef, 'mouseup', cancel);
      useEventListener(target ?? internalRef, 'touchend', cancel);
    }
  });

  if (target) return isLongPressActive;
  return [refCallback, isLongPressActive];
}) as UseLongPress;
