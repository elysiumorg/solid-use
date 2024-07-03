import { createSignal } from 'solid-js';
import { useHotkeys } from './useHotkeys';

const Demo = () => {
  const [count, setCount] = createSignal(0);
  useHotkeys('control+a', () => setCount(prev => prev + 1), {
    preventDefault: true,
  });

  return (
    <div>
      <p>
        Press hot keys <code>ctrl left</code> + <code>a</code>{' '}
      </p>
      <p>
        Count of key presses: <code>{count()}</code>
      </p>
    </div>
  );
};

export default Demo;
