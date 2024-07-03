import { createSignal } from 'solid-js';
import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use key press options type */
export type UseKeyboardParams = {
  /** The target to attach the event listeners to */
  target?: UseEventListenerTarget;
  isRealTime?: boolean;
};

/**
 * @name useKeyboard
 * @description - Hook that help to listen for keyboard events
 * @category Sensors
 *
 * @param {UseEventListenerTarget} [target=window] The target to attach the event listeners to
 * @param {(event: KeyboardEvent) => void} [onKeyDown] The callback function to be invoked on key down
 * @param {(event: KeyboardEvent) => void} [onKeyUp] The callback function to be invoked on key up
 *
 * @example
 * useKeyboard({ onKeyDown: () => console.log('key down'), onKeyUp: () => console.log('key up') })
 */
export const useKeyboard = (params?: UseKeyboardParams) => {
  const [currentButton, setCurrentButton] = createSignal('');

  const onKeyDown = (event: KeyboardEvent) => {
    setCurrentButton(event.key);
  };

  const onKeyUp = () => {
    setCurrentButton('');
  };

  useEventListener(params?.target ?? window, 'keydown', onKeyDown);
  if (params?.isRealTime) {
    useEventListener(params?.target ?? window, 'keyup', onKeyUp);
  }

  return currentButton;
};
