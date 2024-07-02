import { isClient } from '@/utils/helpers';
import { createSignal, type Accessor } from 'solid-js';
import { useInterval } from '../useInterval/useInterval';

declare global {
  interface Performance {
    memory: {
      readonly jsHeapSizeLimit: number;
      readonly totalJSHeapSize: number;
      readonly usedJSHeapSize: number;
    };
  }
}

export interface UseMemoryReturn {
  supported: boolean;
  value: Accessor<Performance['memory']>;
}

/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 *
 * @returns {UseMemoryReturn} An object containing the current memory usage
 *
 * @example
 * const { supported, value } = useMemory();
 */
export const useMemory = (): UseMemoryReturn => {
  const supported = isClient ? 'memory' in performance : false;
  const [value, setValue] = createSignal<Performance['memory']>({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0,
  });

  useInterval(() => setValue(performance.memory), 1000, {
    enabled: supported,
  });

  return { supported, value };
};
