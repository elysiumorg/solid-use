import { renderHook } from '@solidjs/testing-library';
import { useShare } from './useShare';

const mockNavigatorShare = vi.fn();
const mockNavigatorCanShare = vi.fn();
Object.assign(navigator, {
  canShare: mockNavigatorCanShare,
  share: mockNavigatorShare,
});

describe('useShare', () => {
  it('Should use share', () => {
    const { result } = renderHook(useShare);

    expect(typeof result.share).toBe('function');
    expect(result.supported).toBe(true);
  });

  it('Should share data', () => {
    const { result } = renderHook(useShare);

    result.share({ title: 'title', text: 'text', url: 'url' });
    expect(mockNavigatorShare).toHaveBeenCalledWith({
      title: 'title',
      text: 'text',
      url: 'url',
    });

    mockNavigatorCanShare.mockReturnValue(true);
    result.share({
      title: 'title',
      text: 'text',
      url: 'url',
      files: [],
    });
    expect(mockNavigatorCanShare).toHaveBeenCalledOnce();
    expect(mockNavigatorShare).toHaveBeenCalledWith({
      title: 'title',
      text: 'text',
      url: 'url',
      files: [],
    });
  });
});
