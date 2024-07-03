import { renderHook } from '@solidjs/testing-library';
import { useIdle } from './useIdle';

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('Should use idle', () => {
    const { result } = renderHook(useIdle);

    expect(result.idle()).toBeFalsy();
    expect(result.lastActive()).toBeLessThanOrEqual(Date.now());
  });

  it('Should be true after 60e3', () => {
    const { result } = renderHook(useIdle);
    expect(result.idle()).toBeFalsy();

    vi.advanceTimersByTime(60e3);
    expect(result.idle()).toBeTruthy();
  });

  it('Should set initial state', () => {
    const { result } = renderHook(() => useIdle(60e3, { initialValue: true }));
    expect(result.idle()).toBeTruthy();
  });

  it('Should be false after interaction', () => {
    const { result } = renderHook(() => useIdle(60e3));

    vi.advanceTimersByTime(60e3);
    expect(result.idle()).toBeTruthy();

    window.dispatchEvent(new Event('mousemove'));

    expect(result.idle()).toBeFalsy();
    expect(result.lastActive()).toBeLessThanOrEqual(Date.now());
  });

  it('Should be false after visibilitychange event', () => {
    const { result } = renderHook(() => useIdle(60e3));

    vi.advanceTimersByTime(60e3);
    expect(result.idle()).toBeTruthy();

    document.dispatchEvent(new Event('visibilitychange'));
    expect(result.idle()).toBeFalsy();
    expect(result.lastActive()).toBeLessThanOrEqual(Date.now());
  });

  it('Should work with custom events', () => {
    const { result } = renderHook(() =>
      useIdle(60e3, { events: ['mousedown'] }),
    );

    vi.advanceTimersByTime(60e3);
    expect(result.idle()).toBeTruthy();

    window.dispatchEvent(new Event('mousedown'));
    expect(result.idle()).toBeFalsy();

    vi.advanceTimersByTime(60e3);
    expect(result.idle()).toBeTruthy();

    document.dispatchEvent(new Event('mousemove'));
    expect(result.idle()).toBeTruthy();
  });
});
