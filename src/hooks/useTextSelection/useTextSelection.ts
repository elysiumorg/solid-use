import { isClient } from '@/utils/helpers';
import { createSignal, type Accessor } from 'solid-js';
import { useEventListener } from '../useEventListener/useEventListener';

export const getRangesSelection = (selection: Selection) => {
  const rangeCount = selection.rangeCount ?? 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
};

/** The use text selection return type */
export interface UseTextSelectionReturn {
  /** The current selection text */
  text: Accessor<string>;
  /** The current selection ranges */
  ranges: Accessor<Range[]>;
  /** The current selection rects */
  rects: Accessor<DOMRect[]>;
  /** The current selection */
  selection: Accessor<Selection | null>;
}

/**
 * @name useTextSelection
 * @description - Hook that manages the text selection
 * @category Sensors
 *
 * @returns {UseTextSelectionReturn} An object containing the current text selection
 *
 * @example
 * const selection = useTextSelection();
 */
export const useTextSelection = (): UseTextSelectionReturn => {
  const [selection, setSelection] = createSignal<Selection | null>(
    isClient ? document.getSelection() : null,
  );
  const [text, setText] = createSignal('');
  const [ranges, setRanges] = createSignal<Range[]>([]);
  const [rects, setRects] = createSignal<DOMRect[]>([]);

  const onSelectionChange = () => {
    const docSelection = document.getSelection();
    setSelection(docSelection);
    setText(selection()?.toString() ?? '');
    setRanges(selection() ? getRangesSelection(selection() as Selection) : []);
    setRects(ranges().map(range => range.getBoundingClientRect()));
  };

  useEventListener(document, 'selectionchange', onSelectionChange);

  return {
    text,
    ranges,
    rects,
    selection,
  };
};
