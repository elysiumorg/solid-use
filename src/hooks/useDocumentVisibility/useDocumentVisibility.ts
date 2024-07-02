import { createEffect, createSignal, onCleanup } from 'solid-js';

/**
 * @name useDocumentVisibility
 * @description – Hook that provides the current visibility state of the document
 * @category Browser
 *
 * @returns {DocumentVisibilityState} The current visibility state of the document, which can be 'visible' or 'hidden'
 *
 * @example
 * const visibilityState = useDocumentVisibility();
 */
export const useDocumentVisibility = () => {
  const [visibilityState, setVisibilityState] = createSignal(
    document.visibilityState,
  );

  const handleVisibilityChange = () => {
    setVisibilityState(document.visibilityState);
  };

  createEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    onCleanup(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  });

  return visibilityState;
};
