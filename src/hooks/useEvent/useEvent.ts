import { createEffect } from 'solid-js';

export const useEvent = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
): ((...args: Params) => Return) => {
  let callbackRef: typeof callback;

  createEffect(() => {
    callbackRef = callback;
  }, [callback]);

  return (...args) => {
    const fn = callbackRef;
    return fn(...args);
  };
};
