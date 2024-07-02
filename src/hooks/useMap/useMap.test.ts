import { describe, it, expect } from 'vitest';
import { renderHook } from '@solidjs/testing-library';
import { useMap } from './useMap';

describe('useMap hook', () => {
  it('should initialize with the provided values', () => {
    const { result } = renderHook(() =>
      useMap([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    );
    const { value, size } = result;

    expect(value().get('key1')).toBe('value1');
    expect(value().get('key2')).toBe('value2');
    expect(size).toBe(2);
  });

  it('should set a new key-value pair', () => {
    const { result } = renderHook(() => useMap());
    const { value, set } = result;

    set('key1', 'value1');

    expect(value().get('key1')).toBe('value1');
  });

  it('should remove an existing key-value pair', () => {
    const { result } = renderHook(() => useMap([['key1', 'value1']]));
    const { value, remove } = result;

    remove('key1');

    expect(value().has('key1')).toBe(false);
  });

  it('should clear all key-value pairs', () => {
    const { result } = renderHook(() =>
      useMap([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    );
    const { value, clear } = result;

    clear();

    expect(value().size).toBe(0);
  });

  it('should reset to the initial values', () => {
    const { result } = renderHook(() =>
      useMap([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    );
    const { value, set, reset } = result;

    set('key3', 'value3');
    reset();

    expect(value().size).toBe(2);
    expect(value().get('key1')).toBe('value1');
    expect(value().get('key2')).toBe('value2');
    expect(value().has('key3')).toBe(false);
  });

  it('should check if a key exists', () => {
    const { result } = renderHook(() => useMap([['key1', 'value1']]));
    const { has } = result;

    expect(has('key1')).toBe(true);
    expect(has('key2')).toBe(false);
  });
});
