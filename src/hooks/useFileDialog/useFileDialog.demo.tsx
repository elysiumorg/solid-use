import { useFileDialog } from './useFileDialog';

const Demo = () => {
  const fileDialog = useFileDialog();

  return (
    <p onClick={() => console.log(fileDialog.value())}>
      <button type="button" onClick={() => fileDialog.open()}>
        Choose files
      </button>
      <button
        type="button"
        disabled={!fileDialog.value}
        onClick={() => fileDialog.reset()}
      >
        Reset
      </button>
      {fileDialog.value && (
        <div>
          <p>
            You have selected: <b>{fileDialog.value()?.length ?? 0} files</b>
            {Array.from(fileDialog.value() ?? []).map(file => (
              <li>
                <code>{file.name}</code>
              </li>
            ))}
          </p>
        </div>
      )}
    </p>
  );
};

export default Demo;
