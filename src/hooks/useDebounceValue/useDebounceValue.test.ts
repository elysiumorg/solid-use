import { sleep } from '@/utils/helpers';
import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { useDebounceValue } from './useDebounceValue';

describe('useDebounceValue', () => {
  it('should change debounced value when value changes after delay', async () => {
    const [value, setValue] = createSignal(0);

    let randomValue = Math.random();

    const handleRadomValue = () => {
      randomValue = Math.random();
      setValue(randomValue);
    };

    const { result } = renderHook(() => useDebounceValue(value, 500));

    expect(result()).toBe(0);

    for (let index = 0; index < 5; index += 1) {
      handleRadomValue();
    }

    expect(result()).toBe(0);

    await sleep(500);

    expect(result()).toBe(randomValue);
  });
});
