import { getDate } from '@/utils/helpers';
import { createSignal, type Accessor } from 'solid-js';
import { useInterval } from '../useInterval/useInterval';

export type UseTimeReturn = Accessor<{
  seconds: string;
  minutes: string;
  hours: string;
  meridiemHours: {
    value: string;
    type: string;
  };
  day: string;
  month: string;
  year: string;
  timestamp: number;
}>;

/**
 * @name useTime
 * @description - Hook that gives you current time in different values
 * @category Time
 *
 * @returns {UseTimeReturn} An object containing the current time
 *
 * @example
 * const time = useTime();
 */
export const useTime = (): UseTimeReturn => {
  const [time, setTime] = createSignal(getDate());
  useInterval(() => setTime(getDate()), 1000);
  return time;
};
