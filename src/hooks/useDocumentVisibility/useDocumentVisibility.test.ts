import { useDocumentVisibility } from './useDocumentVisibility';
import { renderHook } from '@solidjs/testing-library';

const mockDocumentVisibility = vi.spyOn(document, 'visibilityState', 'get');

describe('useDocumentVisibility', () => {
  it('Should use document visibility', () => {
    const { result } = renderHook(useDocumentVisibility);
    expect(result()).toBe(document.visibilityState);
  });

  it('Should use document visibility on server', () => {
    mockDocumentVisibility.mockReturnValue('hidden');
    vi.mock('@/utils/helpers', () => ({
      isClient: false,
    }));

    const { result } = renderHook(useDocumentVisibility);

    expect(result()).toBe('hidden');
  });

  it('Should return "hidden" after initialization', () => {
    mockDocumentVisibility.mockReturnValue('hidden');
    const { result } = renderHook(useDocumentVisibility);
    expect(result()).toBe('hidden');
  });

  it('Should return "visible" after initialization', () => {
    mockDocumentVisibility.mockReturnValue('visible');
    const { result } = renderHook(useDocumentVisibility);
    expect(result()).toBe('visible');
  });

  it('Should update visibility state on visibilitychange event', () => {
    mockDocumentVisibility.mockReturnValue('visible');
    const { result } = renderHook(useDocumentVisibility);
    expect(result()).toBe('visible');

    mockDocumentVisibility.mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(result()).toBe('hidden');

    mockDocumentVisibility.mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(result()).toBe('visible');
  });
});
