import { useCounter } from '../useCounter/useCounter';
import { useLongPress } from './useLongPress';

const Demo = () => {
  const counter = useCounter();

  const [ref, isLongPressing] = useLongPress(() => counter.inc(), {
    threshold: 500,
  });

  return (
    <>
      <p>
        Long pressed: <code>{isLongPressing().toString()}</code>
      </p>
      <p>
        Clicked: <code>{counter.count()}</code>
      </p>
      <button type="button" ref={ref}>
        Long press
      </button>
    </>
  );
};

export default Demo;
