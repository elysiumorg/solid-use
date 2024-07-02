import { createEffect } from 'solid-js';
import { useHash } from './useHash';

const Demo = () => {
  const [hash, setHash] = useHash();

  createEffect(() => setHash('path/to/page?userId=123'));

  return (
    <div>
      <p>window.location.href:</p>
      <div>
        <pre style={{ 'white-space': 'pre-wrap' }}>{window.location.href}</pre>
      </div>
      <p>Edit hash: </p>
      <p>
        <input
          style={{ width: '100%' }}
          value={hash()}
          onChange={event => setHash(event.target.value)}
        />
      </p>
    </div>
  );
};

export default Demo;
