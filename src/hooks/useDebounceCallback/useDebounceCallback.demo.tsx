import { createSignal } from 'solid-js';

import { useDebounceCallback } from './useDebounceCallback';

const Demo = () => {
  const [value, setValue] = createSignal(0);

  const debouncedSetValue = useDebounceCallback(setValue, 500);

  return (
    <div>
      <p>
        Value: <code>{value()}</code>
      </p>
      <button type="button" onClick={() => debouncedSetValue(Math.random())}>
        Set random value
      </button>
    </div>
  );
};

export default Demo;
