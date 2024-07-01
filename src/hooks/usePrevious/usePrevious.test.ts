import { createSignal } from 'solid-js';
import { usePrevious } from './usePrevious';
import { renderHook } from '@solidjs/testing-library';

describe('usePrevious', () => {
  it('should return the previous value', () => {
    const [value, setValue] = createSignal(0);
    const { result } = renderHook(() => usePrevious(value));

    expect(result()).toBe(undefined);

    setValue(1);
    expect(result()).toBe(0);

    setValue(0);
    expect(result()).toBe(1);
  });
});
