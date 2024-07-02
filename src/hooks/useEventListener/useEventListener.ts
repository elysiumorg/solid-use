import { createEffect, onCleanup } from 'solid-js';

export type UseEventListenerTarget =
  | (() => Element | null)
  | (() => Element)
  | Element
  | Window
  | Document;

const getElement = (target: UseEventListenerTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (
    target instanceof Element ||
    target instanceof Window ||
    target instanceof Document
  ) {
    return target;
  }

  return target;
};

export type UseEventListenerOptions = boolean | AddEventListenerOptions;

export type UseEventListenerReturn<Target extends UseEventListenerTarget> =
  | ((ref: Target) => void)
  | undefined;

export type UseEventListener = {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: Window,
    event: Event | Event[],
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions,
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: Document,
    event: Event | Event[],
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions,
  ): void;

  <
    Target extends UseEventListenerTarget,
    Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap,
  >(
    target: Target,
    event: Event | Event[],
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
  ): void;

  <
    Target extends Element,
    Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap,
  >(
    event: Event | Event[],
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never,
  ): UseEventListenerReturn<Target>;

  <
    Target extends Element,
    Event extends keyof MediaQueryListEventMap = keyof MediaQueryListEventMap,
  >(
    event: Event | Event[],
    listener: (this: Target, event: MediaQueryListEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never,
  ): UseEventListenerReturn<Target>;
};

/**
 * @name useEventListener
 * @description A hook to attach an event listener to a target element, document, or window.
 * @category Browser
 *
 * @template Event Key of the event map.
 * @template Target Element, Document, Window, or custom target.
 * @param {Target} [target] The target to attach the event listener to.
 * @param {Event | Event[]} event The event(s) to listen for.
 * @param {(event: any) => void} listener The callback function to be executed when the event is triggered.
 * @param {UseEventListenerOptions} [options] The options for the event listener.
 * @returns {UseEventListenerReturn<Target>} A callback ref function if no target is specified.
 *
 * @example
 * // Using with window
 * useEventListener(window, 'resize', () => console.log('window resized'));
 *
 * @example
 * // Using with document
 * useEventListener(document, 'click', () => console.log('document clicked'));
 *
 * @example
 * // Using with a specific element
 * useEventListener(document.getElementById('myElement'), 'mouseover', () => console.log('element mouseover'));
 *
 * @example
 * // Using with a ref callback
 * const ref = useEventListener('scroll', () => console.log('scrolled'));
 * // In JSX: <div ref={ref}></div>
 */

export const useEventListener: UseEventListener = (...params: any[]) => {
  const target = (params[1] instanceof Function ? null : params[0]) as
    | UseEventListenerTarget
    | undefined;
  const event = (target ? params[1] : params[0]) as string | string[];
  const events = Array.isArray(event) ? event : [event];
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const options: UseEventListenerOptions | undefined = target
    ? params[3]
    : params[2];

  let internalRef: Element | Document | Window | null;

  const refCallback = (ref: Element | Document | Window | null) => {
    if (!ref) return;
    internalRef = ref;
    events.forEach(event => ref?.addEventListener(event, listener, options));
  };

  createEffect(() => {
    if (!target) return;
    const element = getElement(target);
    if (element) {
      events.forEach(event =>
        element.addEventListener(event, listener, options),
      );
    }
  });

  onCleanup(() => {
    const element = target ? getElement(target) : internalRef;
    if (element) {
      events.forEach(event =>
        element.removeEventListener(event, listener, options),
      );
    }
  });

  if (target) return;
  return refCallback;
};
