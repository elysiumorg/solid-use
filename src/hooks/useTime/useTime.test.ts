import { renderHook } from '@solidjs/testing-library';
import { vi } from 'vitest';
import { useTime } from './useTime';

vi.useFakeTimers().setSystemTime(new Date('1999-03-12'));
const LOCAL_HOURS = new Date('1999-03-12').getHours();

describe('useTime', () => {
  it('Should use time', () => {
    const { result } = renderHook(useTime);

    expect(result().year).toBe('1999');
    expect(result().month).toBe('02');
    expect(result().day).toBe('12');
    expect(result().hours).toBe('03');
    expect(result().minutes).toBe('00');
    expect(result().seconds).toBe('00');
    expect(result().meridiemHours.value).toBe(
      String(LOCAL_HOURS % 12 === 0 ? 12 : LOCAL_HOURS % 12),
    );
    expect(result().meridiemHours.type).toBe(LOCAL_HOURS >= 12 ? 'pm' : 'am');
    expect(result().timestamp).toBe(921196800000);
  });

  it('Should updates every second', () => {
    const { result } = renderHook(useTime);
    expect(result().minutes).toBe('00');
    expect(result().seconds).toBe('00');

    vi.advanceTimersByTime(1000);

    expect(result().minutes).toBe('00');
    expect(result().seconds).toBe('01');

    vi.advanceTimersByTime(59_000);

    expect(result().minutes).toBe('01');
    expect(result().seconds).toBe('00');
  });
});
