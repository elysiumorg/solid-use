import { renderHook } from '@solidjs/testing-library';
import { useStep } from './useStep';

const STEPS = ['1', '2', '3'];

it('should use step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  expect(result.currentStep()).toBe(1);
  expect(result.counts).toBe(3);
  expect(result.isFirst()).toBeTruthy();
  expect(result.isLast()).toBeFalsy();
  expect(typeof result.next).toBe('function');
  expect(typeof result.back).toBe('function');
  expect(typeof result.reset).toBe('function');
});

it('should increase the step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  result.next();
  expect(result.currentStep()).toBe(2);
});

it('should not increase the step when max is reached', () => {
  const { result } = renderHook(() => useStep(1));

  result.next();
  expect(result.currentStep()).toBe(1);
});

it('should decrease the step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  result.next();
  expect(result.currentStep()).toBe(2);

  result.back();
  expect(result.currentStep()).toBe(1);
});

it('should not decrease the step when min is reached', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  result.back();
  expect(result.currentStep()).toBe(1);
});

it('should reset to the initial step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  result.set(3);
  expect(result.currentStep()).toBe(3);

  result.reset();
  expect(result.currentStep()).toBe(1);
});

it('should have valid booleans', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  expect(result.isFirst()).toBeTruthy();
  expect(result.isLast()).toBeFalsy();

  result.next();
  expect(result.isFirst()).toBeFalsy();
  expect(result.isLast()).toBeFalsy();

  result.next();
  expect(result.isFirst()).toBeFalsy();
  expect(result.isLast()).toBeTruthy();

  result.reset();
  expect(result.isFirst()).toBeTruthy();
  expect(result.isLast()).toBeFalsy();
});

it('should set custom step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  result.set(2);
  expect(result.currentStep()).toBe(2);

  result.set('first');
  expect(result.currentStep()).toBe(1);

  result.set('last');
  expect(result.currentStep()).toBe(3);

  result.set(Number.POSITIVE_INFINITY);
  expect(result.currentStep()).toBe(3);

  result.set(Number.NEGATIVE_INFINITY);
  expect(result.currentStep()).toBe(1);
});

describe('Value is object', () => {
  it('should increase the step', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 1, max: STEPS.length }),
    );

    result.next();
    expect(result.currentStep()).toBe(2);
  });

  it('should not increase the step when max is reached', () => {
    const INITIAL_STEP = STEPS.length;
    const { result } = renderHook(() =>
      useStep({ initial: INITIAL_STEP, max: STEPS.length }),
    );

    result.next();
    expect(result.currentStep()).toBe(STEPS.length);
  });

  it('should decrease the step', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 1, max: STEPS.length }),
    );

    result.next();
    expect(result.currentStep()).toBe(2);

    result.back();
    expect(result.currentStep()).toBe(1);
  });

  it('should not decrease the step when min is reached', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 1, max: STEPS.length }),
    );

    result.back();
    expect(result.currentStep()).toBe(1);
  });

  it('should reset to the initial step', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 2, max: STEPS.length }),
    );

    result.set(3);
    expect(result.currentStep()).toBe(3);

    result.reset();
    expect(result.currentStep()).toBe(2);
  });

  it('should have valid booleans', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 1, max: STEPS.length }),
    );

    expect(result.isFirst()).toBeTruthy();
    expect(result.isLast()).toBeFalsy();

    result.next();
    expect(result.isFirst()).toBeFalsy();
    expect(result.isLast()).toBeFalsy();

    result.next();
    expect(result.isFirst()).toBeFalsy();
    expect(result.isLast()).toBeTruthy();

    result.reset();
    expect(result.isFirst()).toBeTruthy();
    expect(result.isLast()).toBeFalsy();
  });

  it('should set custom step', () => {
    const { result } = renderHook(() =>
      useStep({ initial: 1, max: STEPS.length }),
    );

    result.set(2);
    expect(result.currentStep()).toBe(2);

    result.set('first');
    expect(result.currentStep()).toBe(1);

    result.set('last');
    expect(result.currentStep()).toBe(3);

    result.set(Number.POSITIVE_INFINITY);
    expect(result.currentStep()).toBe(3);

    result.set(Number.NEGATIVE_INFINITY);
    expect(result.currentStep()).toBe(1);
  });
});
