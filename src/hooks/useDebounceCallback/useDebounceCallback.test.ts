import { sleep } from '@/utils/helpers';
import { renderHook } from '@solidjs/testing-library';
import { useDebounceCallback } from './useDebounceCallback';

describe('usePrevious', () => {
  it('should change debounced value when value changes after delay', async () => {
    const mockFn = vitest.fn();

    const { result } = renderHook(() => useDebounceCallback(mockFn, 500));

    expect(mockFn).not.toHaveBeenCalled();

    for (let index = 0; index < 5; index += 1) {
      result();
    }

    expect(mockFn).not.toHaveBeenCalled();

    await sleep(500);

    expect(mockFn).toHaveBeenCalledTimes(1);

    result();

    await sleep(500);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
