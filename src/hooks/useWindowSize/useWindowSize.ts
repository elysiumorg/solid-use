import { isClient } from '@/utils/helpers';
import { createEffect, createSignal, onCleanup } from 'solid-js';

/** The use window size return type */
interface UseWindowSizeParams {
  /** The initial window width */
  initialWidth?: number;
  /** The initial window height */
  initialHeight?: number;
}

/** The use window size return type */
export interface UseWindowSizeReturn {
  /** The current window width */
  width: number;
  /** The current window height */
  height: number;
}

/**
 * @name useWindowSize
 * @description - Hook that manages a window size
 * @category Browser
 *
 * @param {number} [params.initialWidth=Number.POSITIVE_INFINITY] The initial window width
 * @param {number} [params.initialHeight=Number.POSITIVE_INFINITY] The initial window height
 * @returns {UseWindowSizeReturn} An object containing the current window width and height
 *
 * @example
 * const size = useWindowSize();
 */
export const useWindowSize = (params?: UseWindowSizeParams) => {
  const [size, setSize] = createSignal({
    width: isClient
      ? window.innerWidth
      : params?.initialWidth ?? Number.POSITIVE_INFINITY,
    height: isClient
      ? window.innerHeight
      : params?.initialWidth ?? Number.POSITIVE_INFINITY,
  });

  createEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', onResize);

    onCleanup(() => {
      window.removeEventListener('resize', onResize);
    });
  });

  return size;
};
