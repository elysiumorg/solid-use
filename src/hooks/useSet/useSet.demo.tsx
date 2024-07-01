import { For, createSignal } from 'solid-js';
import { useSet } from './useSet';

const Demo = () => {
  const [input, setInput] = createSignal('');
  const set = useSet(['@siberiacancode', '@siberiacancode-tests', '@shared']);

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          placeholder="Enter scope"
          value={input()}
          onChange={event => setInput(event.currentTarget.value)}
        />

        <button
          type="button"
          onClick={() => {
            set.add(input().trim().toLowerCase());
            setInput('');
          }}
        >
          Add
        </button>

        <button type="button" onClick={set.clear}>
          Clear
        </button>

        <button
          type="button"
          onClick={() => {
            set.remove(input());
            setInput('');
          }}
        >
          Remove
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', 'flex-wrap': 'wrap' }}>
        <For each={Array.from(set.value())}>
          {scope => <code>{scope}</code>}
        </For>
      </div>
    </>
  );
};

export default Demo;
