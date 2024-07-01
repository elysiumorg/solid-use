import { createSignal } from 'solid-js';
import { usePrevious } from './usePrevious';

const Demo = () => {
  const [count, setCount] = createSignal(0);
  const prevCount = usePrevious(count);

  return (
    <>
      <p>
        Value now: <code>{count()}</code>, value before:{' '}
        <code>{prevCount() ?? 'undefined'}</code>
      </p>
      <button type="button" onClick={() => setCount(prev => prev + 1)}>
        +
      </button>
      <button type="button" onClick={() => setCount(prev => prev - 1)}>
        -
      </button>
    </>
  );
};

export default Demo;
