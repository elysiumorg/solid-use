import { createSignal, type Accessor } from 'solid-js';

/** The use copy to clipboard return type */
interface UseCopyToClipboardReturn {
  /** The copied value */
  value: Accessor<string | null>;
  /** Function to copy to clipboard  */
  copy: CopyFn;
}

type CopyFn = (text: string) => Promise<boolean>;

/**
 * @name useCopyToClipboard
 * @description - Hook that manages a copy to clipboard
 * @category Browser
 *
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { value, copy } = useCopyToClipboard();
 */
export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [value, setValue] = createSignal<string | null>(null);

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setValue(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setValue(null);
      return false;
    }
  };

  return { value, copy };
};
