import { useCounter } from '../useCounter/useCounter';

import { useClickOutside } from './useClickOutside';

const Demo = () => {
  const counter = useCounter();

  const ref = useClickOutside<HTMLDivElement>(() => {
    console.log('click outside');
    counter.inc();
  });

  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        'user-select': 'none',
        'flex-direction': 'column',
        'justify-content': 'center',
        'align-items': 'center',
        border: `1px solid ${counter.count() < 5 ? 'red' : 'green'}`,
      }}
    >
      <p>Click more than 5 times:</p>
      <p>
        <code>{counter.count()}</code>
      </p>
    </div>
  );
};

export default Demo;
