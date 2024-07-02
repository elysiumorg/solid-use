import { createSignal, createMemo, type Accessor } from 'solid-js';

interface UseStepParams {
  initial: number;
  max: number;
}

interface UseStepReturn {
  counts: number;
  currentStep: Accessor<number>;
  isFirst: Accessor<boolean>;
  isLast: Accessor<boolean>;
  next: () => void;
  back: () => void;
  reset: () => void;
  set: (value: number | 'last' | 'first') => void;
}

const FIRST_STEP_VALUE = 1;

/**
 * @name useStep
 * @description - Hook that creates a stepper
 * @category Utilities
 *
 * @param {number} max Maximum number of steps
 * @param {number} [initial=1] Initial value for step
 * @returns {UseStepReturn} An object containing variables and functions to change the step
 *
 * @example
 * const stepper = useStep(5);
 *
 * @example
 * const stepper = useStep({ initial: 2, max: 5 });
 */
export const useStep = (params: number | UseStepParams): UseStepReturn => {
  const max = typeof params === 'object' ? params.max : params;
  const initial =
    typeof params === 'object' ? params.initial : FIRST_STEP_VALUE;

  const initialStep =
    initial > max || initial < FIRST_STEP_VALUE ? FIRST_STEP_VALUE : initial;

  const [currentStep, setCurrentStep] = createSignal(initial);

  const isFirst = createMemo(() => currentStep() === FIRST_STEP_VALUE);
  const isLast = createMemo(() => currentStep() === max);

  const next = () => {
    if (isLast()) return;
    setCurrentStep(prevStep => prevStep + 1);
  };

  const back = () => {
    if (isFirst()) return;
    setCurrentStep(prevStep => prevStep - 1);
  };

  const reset = () => setCurrentStep(initialStep);

  const set = (value: number | 'last' | 'first') => {
    if (value === 'first') return setCurrentStep(FIRST_STEP_VALUE);
    if (value === 'last') return setCurrentStep(max);
    if (value >= max) return setCurrentStep(max);
    if (value <= FIRST_STEP_VALUE) return setCurrentStep(FIRST_STEP_VALUE);
    setCurrentStep(value);
  };

  return {
    counts: max,
    currentStep,
    isFirst,
    isLast,
    next,
    back,
    reset,
    set,
  };
};
