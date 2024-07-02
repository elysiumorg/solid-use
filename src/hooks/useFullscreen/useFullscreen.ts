import screenfull from 'screenfull';
import { createSignal, onCleanup, type Accessor } from 'solid-js';

/** The use fullscreen target element type */
export type UseFullScreenTarget = Element | null | (() => Element);

const getElement = (target: UseFullScreenTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target;
};

/** The use fullscreen options type */
export interface UseFullScreenOptions {
  /** initial value */
  initialValue?: boolean;
  /** on enter fullscreen */
  onEnter?: () => void;
  /** on exit fullscreen */
  onExit?: () => void;
}

/** The use click outside return type */
export interface UseFullScreenReturn {
  enter: () => void;
  exit: () => void;
  toggle: () => void;
  value: Accessor<boolean>;
}

export type UseFullScreen = {
  <Target extends UseFullScreenTarget>(
    target: Target,
    options?: UseFullScreenOptions,
  ): UseFullScreenReturn;

  <Target extends UseFullScreenTarget>(
    options?: UseFullScreenOptions,
    target?: never,
  ): UseFullScreenReturn & { ref: Target };
};

/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {Target} target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn} An object with the fullscreen state and methods
 *
 * @example
 * const { enter, exit, toggle, value } = useFullscreen(ref);
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn & { ref: RefObject<Target> }} An object with the fullscreen state and methods
 *
 * @example
 * const { ref, enter, exit, toggle, value } = useFullscreen();
 */
export const useFullscreen = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseFullScreenTarget
    | undefined;
  const options = (target ? params[1] : params[0]) as
    | UseFullScreenOptions
    | undefined;

  let internalRef: Element | null = null;
  const [value, setValue] = createSignal(options?.initialValue ?? false);

  const refCallback = (ref: Element | null) => {
    if (!ref) return;
    internalRef = ref;
  };

  const onChange = () => {
    if (!screenfull.isEnabled) return;

    if (screenfull.isFullscreen) {
      options?.onEnter?.();
    } else {
      screenfull.off('change', onChange);
      options?.onExit?.();
    }

    setValue(screenfull.isFullscreen);
  };

  const enter = () => {
    const element = target ? getElement(target) : internalRef;
    if (!element) return;

    if (screenfull.isEnabled) {
      try {
        screenfull.request(element);
        screenfull.on('change', onChange);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const exit = () => {
    if (screenfull.isEnabled) screenfull.exit();
  };

  const toggle = () => {
    if (value()) return exit();
    enter();
  };

  onCleanup(() => {
    if (screenfull.isEnabled) screenfull.off('change', onChange);
  });

  return {
    ref: refCallback,
    enter,
    exit,
    toggle,
    value,
  };
}) as UseFullScreen;
