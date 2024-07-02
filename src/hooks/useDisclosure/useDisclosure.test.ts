import { renderHook } from '@solidjs/testing-library';

import { useDisclosure } from './useDisclosure';

it('should use counter', () => {
  const { result } = renderHook(useDisclosure);

  expect(result.opened()).toBeFalsy();
  expect(typeof result.open).toBe('function');
  expect(typeof result.close).toBe('function');
  expect(typeof result.toggle).toBe('function');
});

it('should set initial value', () => {
  const { result } = renderHook(() => useDisclosure(true));

  expect(result.opened()).toBeTruthy();
});

it('should toggle boolean', () => {
  const { result } = renderHook(useDisclosure);

  result.toggle();
  expect(result.opened()).toBeTruthy();

  result.toggle();
  expect(result.opened()).toBeFalsy();
});

it('should change value after open', () => {
  const { result } = renderHook(useDisclosure);

  result.open();
  expect(result.opened()).toBeTruthy();
});

it('should change value after open', () => {
  const { result } = renderHook(() => useDisclosure(true));

  result.close();
  expect(result.opened()).toBeFalsy();
});
