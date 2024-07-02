import { createEffect, createSignal, onCleanup } from 'solid-js';

/**
 * @name usePreferredLanguages
 * @description Hook that returns a browser preferred languages from navigator
 * @category Browser
 *
 * @returns {readonly string[]} An array of strings representing the user's preferred languages
 *
 * @example
 * const languages = usePreferredLanguages();
 */
export const usePreferredLanguages = () => {
  const [language, setLanguage] = createSignal(window.navigator.languages);

  const handleLanguageChange = () => setLanguage(window.navigator.languages);

  createEffect(() => {
    window.addEventListener('languagechange', handleLanguageChange);

    onCleanup(() => {
      window.removeEventListener('languagechange', handleLanguageChange);
    });
  });

  return language;
};
