import { useHover } from './useHover';

const Demo = () => {
  const { ref, isHover } = useHover();

  return (
    <div ref={ref}>
      The current div is <code>{isHover() ? 'hovered' : 'unhovered'}</code>
    </div>
  );
};

export default Demo;
