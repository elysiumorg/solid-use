import { createEffect, createSignal } from 'solid-js';

/**
 * @name useMediaQuery
 * @description - Hook that manages a media query
 * @category Browser
 *
 * @param {string} query The media query string
 * @returns {boolean} A boolean indicating if the media query matches
 *
 * @example
 * const matches = useMediaQuery('(max-width: 768px)');
 */
export const useMediaQuery = (query: string) => {
  const [media, setMedia] = createSignal(window.matchMedia(query).matches);

  const handleMediaChange = () => setMedia(window.matchMedia(query).matches);

  createEffect(() => {
    const matchMedia = window.matchMedia(query);

    matchMedia.addEventListener('change', handleMediaChange);
    return () => {
      matchMedia.removeEventListener('change', handleMediaChange);
    };
  });

  return media;
};
