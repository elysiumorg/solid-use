import { useCounter } from '../useCounter/useCounter';
import { useWindowEvent } from './useWindowEvent';

const Demo = () => {
  const { count, inc } = useCounter(0);

  useWindowEvent('click', () => inc());

  return <p>Window click count: {count()}</p>;
};

export default Demo;
