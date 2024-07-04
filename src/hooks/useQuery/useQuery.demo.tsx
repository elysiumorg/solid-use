import { useCounter } from '../useCounter/useCounter';

import { useQuery } from './useQuery';

interface Pokemon {
  id: number;
  name: string;
}

const getPokemon = (id: number) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res =>
    res.json(),
  ) as Promise<Pokemon>;

const Demo = () => {
  const { inc, dec, count, set, reset } = useCounter(1);
  const { data, isLoading, isError, error } = useQuery(
    () => getPokemon(count()),
    {
      refetchInterval: 2000,
      select: data => data,
    },
  );

  return (
    <>
      <button type="button" disabled={count() === 1} onClick={() => dec()}>
        Prev
      </button>
      <button type="button" onClick={() => inc()}>
        Next
      </button>

      {error() ? (
        <button type="button" onClick={() => reset()}>
          Repair
        </button>
      ) : (
        <button type="button" onClick={() => set(11111)}>
          Broke
        </button>
      )}

      {data() && (
        <div>
          <p>
            Name: <code>{data()?.name}</code>
          </p>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data()?.id}.png`}
            alt={data()?.name}
          />
        </div>
      )}

      {isError() && <p>Error: {error() ? error()?.message : ''}</p>}
      {isLoading() && <p>Loading...</p>}
    </>
  );
};

export default Demo;
