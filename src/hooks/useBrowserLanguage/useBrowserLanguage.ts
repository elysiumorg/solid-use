import { createSignal, createEffect, onCleanup } from 'solid-js';

/**
 * @name useBrowserLanguage
 * @description - Hook that returns the current browser language
 * @category Browser
 *
 * @returns {string} The current browser language
 *
 * @example
 * const browserLanguage = useBrowserLanguage();
 */
export const useBrowserLanguage = () => {
  const [language, setLanguage] = createSignal(navigator.language);

  const handleLanguageChange = () => {
    setLanguage(navigator.language);
  };

  createEffect(() => {
    window.addEventListener('languagechange', handleLanguageChange);

    onCleanup(() =>
      window.removeEventListener('languagechange', handleLanguageChange),
    );
  });

  return language;
};
