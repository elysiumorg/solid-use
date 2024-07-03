import { createEffect, createSignal } from 'solid-js';
import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use keys pressed params */
interface UseKeysPressedParams {
  /** The target to attach the event listeners to */
  target?: UseEventListenerTarget;

  /** Enable or disable the event listeners */
  enabled?: boolean;
}

/**
 * @name useKeysPressed
 * @description - Hook for get keys that were pressed
 * @category Sensors
 *
 * @param {UseEventListenerTarget} [params.target=window] The target to attach the event listeners to
 * @param {boolean} [params.enabled=bollean] Enable or disable the event listeners
 * @returns {useKeysPressedReturns} Array of strings with keys that were press
 *
 * @example
 * const pressedKeys = useKeysPressed();
 */
export const useKeysPressed = (params?: UseKeysPressedParams) => {
  const enabled = params?.enabled ?? true;
  const [keys, setKeys] = createSignal<{ key: string; code: string }[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!enabled) return;
    setKeys(prevKeys => {
      if (prevKeys.some(({ code }) => code === event.code)) return prevKeys;
      return [...prevKeys, { key: event.key, code: event.code }];
    });
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (!enabled) return;
    setKeys(prevKeys => prevKeys.filter(({ code }) => code !== event.code));
  };

  createEffect(() => {
    setKeys([]);
  });

  useEventListener(params?.target ?? window, 'keydown', onKeyDown);
  useEventListener(params?.target ?? window, 'keyup', onKeyUp);

  return keys;
};
