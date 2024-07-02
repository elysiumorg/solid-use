import { useCounter } from './useCounter';

const Demo = () => {
  const { count, inc, dec, reset, set } = useCounter(0, { delay: 100 });

  return (
    <>
      <p>
        Count: <code>{count()}</code>
      </p>
      <button type="button" onClick={() => inc(4)}>
        Increment
      </button>
      <button type="button" onClick={() => dec(4)}>
        Decrement
      </button>
      <button type="button" onClick={() => set(5)}>
        Set (5)
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
