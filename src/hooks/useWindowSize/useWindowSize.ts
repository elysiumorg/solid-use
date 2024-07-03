import { isClient } from '@/utils/helpers';
import { createSignal } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use window size return type */
interface UseWindowSizeParams {
  /** Whether to include the scrollbar in the window size calculation */
  includeScrollbar?: boolean;
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
  const includeScrollbar = params?.includeScrollbar ?? true;

  const getInitialSize = () => {
    if (!isClient) {
      return {
        width: Number.POSITIVE_INFINITY,
        height: Number.POSITIVE_INFINITY,
      };
    }

    return {
      width: includeScrollbar
        ? window.innerWidth
        : window.document.documentElement.clientWidth,
      height: includeScrollbar
        ? window.innerHeight
        : window.document.documentElement.clientHeight,
    };
  };

  const [size, setSize] = createSignal(getInitialSize());

  const onResize = () => {
    if (includeScrollbar) {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    } else {
      setSize({
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight,
      });
    }
  };

  useEventListener(window, 'resize', onResize);

  return size;
};
