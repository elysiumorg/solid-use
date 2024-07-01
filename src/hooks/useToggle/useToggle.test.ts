import { renderHook } from '@solidjs/testing-library';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  test('should toggle between true and false by default', () => {
    const { result } = renderHook(() => useToggle([true, false]));

    const [state, toggle] = result;

    expect(state()).toBe(true);

    toggle();
    expect(state()).toBe(false);

    toggle();
    expect(state()).toBe(true);
  });

  test('should toggle between custom values', () => {
    const { result } = renderHook(() => useToggle(['light', 'dark'] as const));

    const [state, toggle] = result;

    expect(state()).toBe('light');

    toggle();
    expect(state()).toBe('dark');

    toggle();
    expect(state()).toBe('light');
  });

  test('should set value directly when passed as argument', () => {
    const { result } = renderHook(() => useToggle(['light', 'dark'] as const));

    const [state, toggle] = result;

    toggle('dark');
    expect(state()).toBe('dark');

    toggle('light');
    expect(state()).toBe('light');
  });

  test('should handle single value array', () => {
    const { result } = renderHook(() => useToggle(['single'] as const));

    const [state, toggle] = result;

    expect(state()).toBe('single');

    toggle();
    expect(state()).toBe('single');
  });
});
