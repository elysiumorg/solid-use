import { useEyeDropper } from './useEyeDropper';

const Demo = () => {
  const eyeDropper = useEyeDropper();

  return (
    <>
      <p>
        supported: <code>{String(eyeDropper.supported)}</code>
      </p>
      <p>
        value:{' '}
        <span>{eyeDropper.value() ? eyeDropper.value() : 'choose color'}</span>
      </p>
      <div
        style={{
          'background-color': eyeDropper.value(),
          width: 'max-content',
        }}
      >
        Hello
      </div>
      <button
        type="button"
        disabled={!eyeDropper.supported}
        onClick={() => eyeDropper.open()}
      >
        Open eye dropper
      </button>
    </>
  );
};

export default Demo;
