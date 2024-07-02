import { isClient } from '@/utils/helpers';
import type {
  ColorSelectionOptions,
  ColorSelectionResult,
  EyeDropperConstructor,
} from '@/utils/types';
import { createSignal, type Accessor } from 'solid-js';

declare global {
  interface Window {
    readonly EyeDropper?: EyeDropperConstructor | undefined;
  }
}

/** The color selection return type */
export interface UseEyeDropperReturn {
  supported: boolean;
  value: Accessor<string>;
  open: (
    colorSelectionOptions?: ColorSelectionOptions,
  ) => Promise<ColorSelectionResult>;
}

/**
 * @name useEyeDropper
 * @description - Hook that gives you access to the eye dropper
 * @category Browser
 *
 * @param {string} [initialValue=undefined] The initial value for the eye dropper
 * @returns {UseEyeDropperReturn} An object containing the supported status, the value and the open method
 *
 * @example
 * const { supported, value, open } = useEyeDropper();
 */
export const useEyeDropper = (
  initialValue: string | undefined = undefined,
): UseEyeDropperReturn => {
  const supported = isClient ? 'EyeDropper' in window : false;
  const [value, setValue] = createSignal(initialValue ?? '');

  const open = async (colorSelectionOptions?: ColorSelectionOptions) => {
    if (!window.EyeDropper) throw new Error('EyeDropper is not supported');
    const eyeDropper = new window.EyeDropper();
    const result = await eyeDropper.open(colorSelectionOptions);
    setValue(result.sRGBHex);
    return result;
  };

  return {
    supported,
    value,
    open,
  };
};
