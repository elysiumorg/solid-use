import { renderHook } from '@solidjs/testing-library';

import { useBoolean } from './useBoolean';

describe('useBoolean', () => {
  it('Should use counter', () => {
    const { result } = renderHook(useBoolean);
    const [on] = result;

    expect(on()).toBeFalsy();
  });

  it('Should set initial value', () => {
    const { result } = renderHook(() => useBoolean(true));
    const [value] = result;

    expect(value()).toBeTruthy();
  });

  it('Should toggle boolean', () => {
    const { result } = renderHook(useBoolean);
    const [value, toggle] = result;

    toggle();
    expect(value()).toBeTruthy();

    toggle();
    expect(value()).toBeFalsy();

    toggle(false);
    expect(value()).toBeFalsy();

    toggle(true);
    expect(value()).toBeTruthy();
  });
});
