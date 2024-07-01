import { useToggle } from './useToggle';

const Demo = () => {
  const [value, toggle] = useToggle([
    'blue',
    'orange',
    'black',
    'teal',
    'purple',
  ] as const);

  return (
    <button
      type="button"
      style={{ 'background-color': value() }}
      onClick={() => toggle()}
    >
      {value()}
    </button>
  );
};

export default Demo;
