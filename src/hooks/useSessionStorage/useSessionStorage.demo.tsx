import { Match, Switch } from 'solid-js';
import { useSessionStorage } from './useSessionStorage';

const Demo = () => {
  const [value, setValue, removeValue] = useSessionStorage<number>(
    'session-key',
    {
      initialValue: 0,
    },
  );

  return (
    <div>
      <p>
        Count: <code>{value() ?? 'undefined'}</code>
      </p>
      <Switch>
        <Match when={value() !== undefined}>
          <button type="button" onClick={() => setValue(prev => prev + 1)}>
            Increment
          </button>
          <button
            type="button"
            onClick={() => setValue((prev = 0) => prev - 1)}
          >
            Decrement
          </button>
          <button type="button" onClick={() => removeValue()}>
            Remove
          </button>
        </Match>
        <Match when={value() === undefined}>
          <button type="button" onClick={() => setValue(0)}>
            Set
          </button>
        </Match>
      </Switch>
    </div>
  );
};

export default Demo;
