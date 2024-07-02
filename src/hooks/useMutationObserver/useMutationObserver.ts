import { createEffect } from 'solid-js';

export function useMutationObserver<Element extends HTMLElement>(
  callback: MutationCallback,
  options: MutationObserverInit,
  target?: HTMLElement | (() => HTMLElement) | null,
) {
  let observer: MutationObserver;
  const ref: Element | null = null;

  createEffect(() => {
    const targetElement = typeof target === 'function' ? target() : target;

    if (targetElement || ref) {
      observer = new MutationObserver(callback);
      observer.observe(targetElement || ref!, options);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return ref;
}
