import { renderHook } from '@solidjs/testing-library';
import { useCopyToClipboard } from './useCopyToClipboard';

const mockNavigatorClipboardWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    ...global.navigator.clipboard,
    writeText: mockNavigatorClipboardWriteText,
  },
});

const mockDocumentExecCommand = vi.fn();
Object.assign(document, {
  execCommand: mockDocumentExecCommand,
});

it('should use copy to clipboard', () => {
  const { result } = renderHook(useCopyToClipboard);

  expect(result.value()).toBeNull();
  expect(typeof result.copy).toBe('function');
});

it('should copy value to clipboard', async () => {
  const { result } = renderHook(useCopyToClipboard);

  await result.copy('string');

  expect(result.value()).toBe('string');
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledOnce();
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('string');
});
