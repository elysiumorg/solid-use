import { renderHook } from '@solidjs/testing-library';

import { useDisclosure } from './useDisclosure';

it('Should use counter', () => {
  const { result } = renderHook(useDisclosure);

  expect(result.opened()).toBeFalsy();
  expect(typeof result.open).toBe('function');
  expect(typeof result.close).toBe('function');
  expect(typeof result.toggle).toBe('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useDisclosure(true));

  expect(result.opened()).toBeTruthy();
});

it('Should toggle boolean', () => {
  const { result } = renderHook(useDisclosure);

  result.toggle();
  expect(result.opened()).toBeTruthy();

  result.toggle();
  expect(result.opened()).toBeFalsy();
});

it('Should change value after open', () => {
  const { result } = renderHook(useDisclosure);

  result.open();
  expect(result.opened()).toBeTruthy();
});

it('Should change value after open', () => {
  const { result } = renderHook(() => useDisclosure(true));

  result.close();
  expect(result.opened()).toBeFalsy();
});
