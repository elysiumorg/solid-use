import { renderHook, waitFor } from '@solidjs/testing-library';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'default title';
  });

  it('should use document title', () => {
    const { result } = renderHook(useDocumentTitle);
    const [title, setTitle] = result;

    expect(title()).toBe('default title');
    expect(typeof setTitle).toBe('function');
  });

  it('should be set initial title', () => {
    const { result } = renderHook(() => useDocumentTitle('title'));

    waitFor(() => expect(result[0]).toBe('title'));
  });

  it('should be set new title', () => {
    const { result } = renderHook(useDocumentTitle);

    result[1]('new title');
    waitFor(() => expect(result[0]).toBe('new title'));
  });

  it('should be restore initial title when unmount', () => {
    const { result } = renderHook(() =>
      useDocumentTitle('title', { restoreOnUnmount: true }),
    );

    result[1]('new title');
    waitFor(() => expect(result[0]).toBe('new title'));
  });
});
