import {
  createEffect,
  createSignal,
  onCleanup,
  type Accessor,
  type JSX,
} from 'solid-js';

/* The use file dialog options */
export interface UseFileDialogOptions
  extends Pick<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    'multiple' | 'accept'
  > {
  /** The capture value */
  capture?: string;
  /** The reset value */
  reset?: boolean;
}

const DEFAULT_OPTIONS = {
  multiple: true,
  accept: '*',
  reset: false,
} satisfies UseFileDialogOptions;

/* The use file dialog return type */
export interface UseFileDialogReturn {
  /** The selected files */
  value: Accessor<FileList | null>;
  /** The open function */
  open: (openParams?: UseFileDialogOptions) => void;
  /** The reset function */
  reset: () => void;
}

export type UseFileDialog = {
  (
    callback?: (value: FileList | null) => void,
    options?: UseFileDialogOptions,
  ): UseFileDialogReturn;

  (options?: UseFileDialogOptions, callback?: never): UseFileDialogReturn;
};

/**
 * @name useFileDialog
 * @description - Hook to handle file input
 * @category Browser
 *
 * @overload
 * @param {(value: FileList | null) => void} callback The callback to execute when a file is selected
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog((value) => console.log(value));
 *
 * @overload
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog({ accept: 'image/*' });
 */
export const useFileDialog = ((...params: any[]) => {
  const callback = (typeof params[0] === 'function' ? params[0] : undefined) as
    | ((value: FileList | null) => void)
    | undefined;
  const options = (callback ? params[0] : params[1]) as
    | UseFileDialogOptions
    | undefined;

  const [value, setValue] = createSignal<FileList | null>(null);
  let input: HTMLInputElement;

  const reset = () => {
    setValue(null);
    callback?.(null);
    if (input) input.value = '';
  };

  const open = (openParams?: UseFileDialogOptions) => {
    if (!input) return;

    input.multiple =
      openParams?.multiple ?? options?.multiple ?? DEFAULT_OPTIONS.multiple;
    input.accept =
      openParams?.accept ?? options?.accept ?? DEFAULT_OPTIONS.accept;

    const capture = openParams?.capture ?? options?.capture;
    if (capture) input.capture = capture;

    if (openParams?.reset ?? options?.reset ?? DEFAULT_OPTIONS.reset) reset();

    input.click();
  };

  createEffect(() => {
    const init = () => {
      const input = document.createElement('input');
      input.type = 'file';

      input.addEventListener('change', (event: Event) => {
        const { files } = event.target as HTMLInputElement;
        setValue(files);
        callback?.(files);
      });

      return input;
    };

    input = init();
    onCleanup(() => {
      input.remove();
    });
  });

  return { value, open, reset };
}) as UseFileDialog;
