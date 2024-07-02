import { useMeasure } from './useMeasure';

const Demo = () => {
  const { ref, rect } = useMeasure<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        resize: 'horizontal',
        overflow: 'auto',
      }}
    >
      <p>
        width: <code>{rect().width}</code>
      </p>
      <p>
        height: <code>{rect().height}</code>
      </p>
      <p>
        right: <code>{rect().right}</code>
      </p>
      <p>
        bottom: <code>{rect().bottom}</code>
      </p>
    </div>
  );
};

export default Demo;
