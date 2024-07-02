import { renderHook } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.count()).toBe(0);
  });

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.count()).toBe(5);
  });

  it('should increment the count', () => {
    const { result } = renderHook(() => useCounter(5));
    result.inc();
    expect(result.count()).toBe(6);
  });

  it('should decrement the count', () => {
    const { result } = renderHook(() => useCounter(5));
    result.dec();
    expect(result.count()).toBe(4);
  });

  it('should reset the count', () => {
    const { result } = renderHook(() => useCounter(5));

    result.inc();
    result.reset();

    expect(result.count()).toBe(5);
  });

  it('should set the count', () => {
    const { result } = renderHook(() => useCounter(5));
    result.set(10);
    expect(result.count()).toBe(10);
  });

  it('should respect min and max constraints', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));

    result.inc(10);
    result.dec(20);

    expect(result.count()).toBe(0);
  });

  it('should delay increment and decrement', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCounter(0, { delay: 1000 }));
    result.inc(5);
    expect(result.count()).toBe(0);
    vi.advanceTimersByTime(5000);
    expect(result.count()).toBe(5);
    result.dec(5);
    expect(result.count()).toBe(5);
    vi.advanceTimersByTime(5000);
    expect(result.count()).toBe(0);
    vi.useRealTimers();
  });
});
