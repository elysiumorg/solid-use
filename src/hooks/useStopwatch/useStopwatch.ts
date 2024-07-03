import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

const getStopwatchTime = (time: number) => {
  if (!time)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      count: 0,
    };

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return { days, hours, minutes, seconds, count: time };
};

/** The use stopwatch return type */
export interface UseStopwatchReturn {
  /** The paused state of the stopwatch */
  paused: Accessor<boolean>;
  /** The time of the stopwatch */
  time: Accessor<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    count: number;
  }>;

  /** The function to pause the stopwatch */
  pause: () => void;
  /** The function to start the stopwatch */
  start: () => void;
  /** The function to reset the stopwatch */
  reset: () => void;
  /** The function to toggle the stopwatch */
  toggle: () => void;
}

/** The use stopwatch options */
export interface UseStopwatchOptions {
  /** The enabled state of the timer */
  enabled?: boolean;
}

type UseStopwatch = {
  (initialTime?: number, options?: UseStopwatchOptions): UseStopwatchReturn;
  (
    options?: UseStopwatchOptions & { initialTime?: number },
  ): UseStopwatchReturn;
};
/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 * @category Time
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.enabled=true] The enabled state of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { enabled: false });
 *
 * @overload
 * @param {number} [options.initialTime=0] -The initial time of the timer
 * @param {boolean} [options.enabled=true] The enabled state of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, enabled: false });
 */
export const useStopwatch = ((...params: any[]) => {
  const initialTime =
    (typeof params[0] === 'number'
      ? (params[0] as number | undefined)
      : (params[0] as UseStopwatchOptions & { initialTime?: number })
          ?.initialTime) ?? 0;

  const options =
    typeof params[0] === 'number'
      ? (params[1] as UseStopwatchOptions | undefined)
      : (params[0] as
          | (UseStopwatchOptions & { initialTime?: number })
          | undefined);

  const [time, setTime] = createSignal(getStopwatchTime(initialTime));
  const [paused, setPaused] = createSignal(!options?.enabled);

  const onInterval = () => {
    const updatedCount = time().count + 1;

    if (updatedCount % 60 === 0) {
      return setTime(prev => ({
        ...prev,
        minutes: prev.minutes + 1,
        seconds: 0,
        count: updatedCount,
      }));
    }

    if (updatedCount % (60 * 60) === 0) {
      return setTime(prev => ({
        ...prev,
        hours: prev.hours + 1,
        minutes: 0,
        seconds: 0,
        count: updatedCount,
      }));
    }

    if (updatedCount % (60 * 60 * 24) === 0) {
      return setTime(prev => ({
        ...prev,
        days: prev.days + 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        count: updatedCount,
      }));
    }

    setTime({
      ...time(),
      seconds: time().seconds + 1,
      count: updatedCount,
    });
  };

  createEffect(() => {
    if (paused()) return;
    const interval = setInterval(() => onInterval(), 1000);
    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return {
    time,
    paused,
    pause: () => setPaused(true),
    start: () => setPaused(false),
    reset: () => setTime(getStopwatchTime(initialTime)),
    toggle: () => setPaused(prevPause => !prevPause),
  };
}) as UseStopwatch;
