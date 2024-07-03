import { createEffect, createSignal, onCleanup, type JSX } from 'solid-js';

/** The use script status */
export type UseScriptStatus = 'loading' | 'ready' | 'error' | 'unknown';
export const SCRIPT_STATUS_ATTRIBUTE_NAME = 'script-status';

/** The use script options extends from attributes script tag */
export interface UseScriptOptions
  extends JSX.HTMLAttributes<HTMLScriptElement> {
  /** Whether to remove the script on unmount */
  removeOnUnmount?: boolean;
  /** Whether to load the script asynchronously */
  async?: boolean;
}

/**
 * @name useScript
 * @description - Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
 * @category Browser
 *
 * @param {string} src The source of the script
 * @param {UseScriptOptions} [options] The options of the script extends from attributes script tag
 * @param {boolean} [options.removeOnUnmount=true] Whether to remove the script on unmount
 * @param {boolean} [options.async=true] Whether to load the script asynchronously
 * @returns {UseScriptStatus} The status of the script
 *
 * @example
 * const status = useScript('https://example.com/script.js');
 */
export const useScript = (src: string, options: UseScriptOptions = {}) => {
  const getDefaultStatus = () => {
    const script = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement;
    const scriptStatus = script?.getAttribute(
      SCRIPT_STATUS_ATTRIBUTE_NAME,
    ) as UseScriptStatus;
    if (scriptStatus) return scriptStatus;
    if (script) return 'unknown';

    return 'loading';
  };

  const [status, setStatus] = createSignal<UseScriptStatus>(getDefaultStatus());
  const { removeOnUnmount = true, async = true } = options;

  createEffect(() => {
    const existedScript = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement;
    const scriptStatus = existedScript?.getAttribute(
      SCRIPT_STATUS_ATTRIBUTE_NAME,
    ) as UseScriptStatus;
    if (scriptStatus) return setStatus(scriptStatus);
    if (existedScript) return setStatus('unknown');

    const script = document.createElement('script');
    script.src = src;
    script.async = async;

    for (const [key, value] of Object.entries(options)) {
      script.setAttribute(key, String(value));
    }

    script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'loading');
    document.body.appendChild(script);

    const onLoad = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'ready');
      setStatus('ready');
    };

    const onError = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'error');
      setStatus('error');
    };

    const removeEventListeners = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    onCleanup(() => {
      if (removeOnUnmount) {
        script.remove();
        removeEventListeners();
      }
    });
  });

  return status;
};
