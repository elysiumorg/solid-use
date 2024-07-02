import { createSignal } from 'solid-js';
import { useDocumentEvent } from './useDocumentEvent';

const Demo = () => {
  const [count, setCount] = createSignal(0);

  useDocumentEvent('click', () => setCount(prev => prev + 1));

  return <p>Document click count: {count()}</p>;
};

export default Demo;
