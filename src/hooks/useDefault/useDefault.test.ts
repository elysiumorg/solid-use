import { renderHook } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { useDefault } from './useDefault';

describe('useDefault hook', () => {
  it('should return the initial value when it is defined', () => {
    const { result } = renderHook(() => useDefault('initial', 'default'));
    const [value] = result;

    expect(value()).toBe('initial');
  });

  it('should return the default value when the initial value is null', () => {
    const { result } = renderHook(() => useDefault(null, 'default'));
    const [value] = result;

    expect(value()).toBe('default');
  });

  it('should return the default value when the initial value is undefined', () => {
    const { result } = renderHook(() => useDefault(undefined, 'default'));
    const [value] = result;

    expect(value()).toBe('default');
  });

  it('should return the initial value when it is a function', () => {
    const { result } = renderHook(() => useDefault(() => 'initial', 'default'));
    const [value] = result;

    expect(value()).toBe('initial');
  });

  it('should update the value when setValue is called', () => {
    const { result } = renderHook(() => useDefault('initial', 'default'));
    const [value, setValue] = result;

    setValue('new value');

    expect(value()).toBe('new value');
  });

  it('should revert to the default value when setValue is called with null', () => {
    const { result } = renderHook(() => useDefault('initial', 'default'));
    const [value, setValue] = result;

    setValue(null);

    expect(value()).toBe('default');
  });

  it('should revert to the default value when setValue is called with undefined', () => {
    const { result } = renderHook(() => useDefault('initial', 'default'));
    const [value, setValue] = result;

    setValue(undefined);

    expect(value()).toBe('default');
  });
});
