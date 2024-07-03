import { renderHook } from '@solidjs/testing-library';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('Should use timeout', () => {
    const { result } = renderHook(() => useTimeout(vi.fn(), 5000));

    expect(result.ready()).toBeFalsy();
    expect(typeof result.clear).toBe('function');
  });

  it('Should call callback after the timer expires', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTimeout(callback, 5000));

    vi.advanceTimersByTime(2500);
    expect(result.ready()).toBeFalsy();
    expect(callback).toBeCalledTimes(0);

    vi.advanceTimersByTime(5000);

    expect(result.ready()).toBeTruthy();
    expect(callback).toBeCalledTimes(1);
  });

  it('Should clear the timeout', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTimeout(callback, 5000));

    result.clear();
    vi.clearAllTimers();

    expect(result.ready()).toBeTruthy();
    expect(callback).not.toBeCalled();
  });
});
