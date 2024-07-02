import { useDocumentTitle } from './useDocumentTitle';

const Demo = () => {
  const [title, setTitle] = useDocumentTitle();

  return (
    <div>
      <p>Title: {title()}</p>
      <input value={title()} onChange={event => setTitle(event.target.value)} />
    </div>
  );
};

export default Demo;
