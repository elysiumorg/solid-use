import { useMouse } from './useMouse';

const Demo = () => {
  const [ref, value] = useMouse<HTMLDivElement>();

  return (
    <div ref={ref}>
      <p>Mouse position</p>

      <p>
        x: <code>{value().x}</code>
      </p>
      <p>
        y: <code>{value().y}</code>
      </p>

      <p>Element position</p>

      <p>
        x: <code>{value().elementX}</code>
      </p>
      <p>
        y: <code>{value().elementY}</code>
      </p>
    </div>
  );
};

export default Demo;
