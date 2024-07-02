import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';
import { useMutationObserver } from '../useMutationObserver/useMutationObserver';

/** The use document title options type */
export interface UseDocumentTitleOptions {
  /** Restore the previous title on unmount */
  restoreOnUnmount?: boolean;
}

/** The use document title return type */
export type UseDocumentTitleReturn = [
  /** The current title */
  title: Accessor<string>,

  /** Function to update the title */
  setTitle: (title: string) => void,
];

/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 * @category Browser
 *
 * @param {string} [value] The initial title. If not provided, the current document title will be used
 * @param {boolean} [options.restoreOnUnmount] Restore the previous title on unmount
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const [title, setTitle] = useDocumentTitle();
 */
export function useDocumentTitle(
  value?: string,
  options?: UseDocumentTitleOptions,
): UseDocumentTitleReturn {
  const prevTitleRef = document.title;
  const [title, setTitle] = createSignal(value ?? document.title);

  useMutationObserver(
    () => {
      if (document && document.title !== title()) {
        setTitle(document.title);
      }
    },
    { childList: true },
    document.head.querySelector('title'),
  );

  createEffect(() => {
    if (options?.restoreOnUnmount) {
      onCleanup(() => {
        document.title = prevTitleRef;
      });
    }
  }, []);

  const set = (value: string) => {
    const updatedValue = value.trim();
    if (updatedValue.length > 0) document.title = updatedValue;
  };

  createEffect(() => {
    if (typeof value !== 'string') return;
    set(value);
  });

  return [title, set];
}
