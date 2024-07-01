import 'core-js/proposals/set-methods-v2';

import { renderHook } from '@solidjs/testing-library';
import { useSet } from './useSet';

describe('useSet', () => {
  it('should has value', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    expect(result.has(3)).toBeTruthy();
    expect(result.has(4)).toBeFalsy();
  });

  it('should add a new value', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.add(4);

    expect(result.value()).toEqual(new Set([1, 2, 3, 4]));
  });

  it('should remove a value', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    const beRemoved = result.remove(3);
    expect(beRemoved).toBeTruthy();
    expect(result.value()).toEqual(new Set([1, 2]));

    const notBeRemoved = result.remove(123);
    expect(notBeRemoved).toBeFalsy();
  });

  it('should clear all values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.clear();

    expect(result.value()).toEqual(new Set([]));
  });

  it('should toggle all values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.toggle(3);

    expect(result.value()).toEqual(new Set([1, 2]));

    result.toggle(3);

    expect(result.value()).toEqual(new Set([1, 2, 3]));
  });

  it('should union values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.union(new Set([4, 5, 6]));

    expect(result.value()).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it('should intersection values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.intersection(new Set([2, 3, 4]));

    expect(result.value()).toEqual(new Set([2, 3]));
  });

  it('should difference values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.difference(new Set([3, 4, 6]));

    expect(result.value()).toEqual(new Set([1, 2]));
  });

  it('should symmetric difference values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.symmetricDifference(new Set([2, 3, 4]));

    expect(result.value()).toEqual(new Set([1, 4]));
  });

  it('should reset values', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    result.reset();

    expect(result.value()).toEqual(new Set([1, 2, 3]));
  });
});
