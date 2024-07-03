import { useScript } from './useScript';

const Demo = () => {
  const status = useScript('https://unpkg.com/solid-js@1.8.18/dist/solid.js', {
    async: true,
    removeOnUnmount: true,
    onLoad: () => console.log('script is ready'),
    onError: () => console.error('script failed to load'),
  });

  return (
    <div>
      <p>
        Current status: <code>{status()}</code>
      </p>

      {status() === 'loading' && <p>Loading...</p>}
      {status() === 'ready' && <p>You can use the script</p>}
    </div>
  );
};

export default Demo;
