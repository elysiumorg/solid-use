import { useKeyboard } from './useKeyboard';

const Demo = () => {
  const currentButton = useKeyboard({ isRealTime: true });

  return (
    <div>
      <p>Press any keyboard buttondas: {currentButton()}</p>
    </div>
  );
};

export default Demo;
