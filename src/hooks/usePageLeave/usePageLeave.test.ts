import { renderHook } from '@solidjs/testing-library';
import { usePageLeave } from './usePageLeave';

describe('usePageLeave', () => {
  it('Should use page leave', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePageLeave(callback));
    expect(typeof result()).toBe('boolean');
  });

  it('Should call the callback on page leave', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePageLeave(callback));
    expect(result()).toBe(false);

    document.dispatchEvent(new Event('mouseleave'));
    expect(callback).toBeCalledTimes(1);
    expect(result()).toBe(true);

    document.dispatchEvent(new Event('mouseenter'));
    expect(result()).toBe(false);

    document.dispatchEvent(new Event('mouseleave'));
    expect(callback).toBeCalledTimes(2);
    expect(result()).toBe(true);
  });
});
