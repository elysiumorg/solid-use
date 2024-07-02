import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should use interval', () => {
    const { result } = renderHook(() => useInterval(vi.fn, 1000));
    expect(result.isActive()).toBe(true);
    expect(typeof result.pause).toBe('function');
    expect(typeof result.resume).toBe('function');
  });

  it('should pause and resume properly', () => {
    const { result } = renderHook(() => useInterval(() => {}, 1000));
    const { pause, resume } = result;

    expect(result.isActive()).toBe(true);
    pause();
    expect(result.isActive()).toBe(false);
    resume();
    expect(result.isActive()).toBe(true);
  });

  it('should not be active when disabled', () => {
    const { result } = renderHook(() =>
      useInterval(() => {}, 1000, { enabled: false }),
    );

    expect(result.isActive()).toBe(false);
  });

  it('should call callback on interval', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    expect(result.isActive()).toBe(true);
    vi.advanceTimersByTime(1000);

    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(2);
  });

  it('should not call callback if disabled when delay changes', () => {
    const callback = vi.fn();

    const [delay, setDelay] = createSignal(0);

    const { result } = renderHook(() =>
      useInterval(callback, delay(), { enabled: false }),
    );

    setDelay(1);

    expect(result.isActive()).toBe(false);
    expect(callback).not.toBeCalled();
  });
});
