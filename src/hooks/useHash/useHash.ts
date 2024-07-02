import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash return type */
type UseHashReturn = [Accessor<string>, (value: string) => void];

/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category Browser
 *
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash();
 */
export const useHash = (): UseHashReturn => {
  const [hash, setHash] = createSignal(window ? getHash() : '');

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
  };

  createEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    onCleanup(() => {
      window.removeEventListener('hashchange', onHashChange);
    });
  });

  return [hash, set] as const;
};
