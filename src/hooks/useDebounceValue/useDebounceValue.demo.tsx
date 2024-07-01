import { createSignal } from 'solid-js';
import { useDebounceValue } from './useDebounceValue';

const Demo = () => {
  const [value, setValue] = createSignal(0);

  const debouncedValue = useDebounceValue(value, 500);

  return (
    <div>
      <p>
        Value: <code>{value()}</code>
      </p>
      <p>
        Debounced value: <code>{debouncedValue()}</code>
      </p>
      <button type="button" onClick={() => setValue(Math.random())}>
        Set random value
      </button>
    </div>
  );
};

export default Demo;
