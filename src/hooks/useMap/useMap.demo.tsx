import { createSignal } from 'solid-js';
import { useMap } from './useMap';

const Demo = () => {
  const [name, setName] = createSignal('');
  const [age, setAge] = createSignal('');

  const users = useMap([
    ['Dima', 25],
    ['Danila', 1],
  ]);

  const addUser = () => {
    users.set(name(), parseInt(age(), 10));
    setName('');
    setAge('');
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          placeholder="Name"
          value={name()}
          onInput={e => setName(e.target.value)}
        />
        <input
          placeholder="Age"
          type="number"
          value={age()}
          onInput={e => setAge(e.target.value)}
        />

        <button type="button" onClick={addUser}>
          Add
        </button>
      </div>

      <div style={{ 'margin-top': '8px' }}>
        {Array.from(users.value()).map(([name, age]) => (
          <div>
            {name}: <code>{age}</code>
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
