import { useOrientation } from './useOrientation';

const Demo = () => {
  const orientation = useOrientation();

  return (
    <>
      <p>
        Angle: <code>{orientation().angle}</code>
      </p>
      <p>
        Type: <code>{orientation().type}</code>
      </p>
    </>
  );
};

export default Demo;
