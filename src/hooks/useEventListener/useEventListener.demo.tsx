import { For, createSignal } from 'solid-js';
import { useEventListener } from './useEventListener';
import { useQueue } from '../useQueue/useQueue';
import { useCounter } from '../useCounter/useCounter';

const Demo = () => {
  const { add, remove, queue, size } = useQueue<string>();
  const { count, inc } = useCounter();

  const divRef = useEventListener<HTMLDivElement>(
    'click',
    () => {
      if (size() > 10) remove();
      add(`${count()} - div click`);
      inc();
    },
    {
      passive: true,
    },
  );

  const articleRef = useEventListener(
    'click',
    () => {
      if (size() > 10) remove();
      add(`${count()} - article click`);
      inc();
    },
    {
      passive: true,
    },
  );

  const sectionRef = useEventListener(
    'click',
    event => {
      event.stopPropagation();
      if (size() > 10) remove();
      add(`${count()} - section click with stopPropagation`);
      inc();
    },
    {
      passive: true,
    },
  );

  useEventListener(
    window,
    'click',
    () => {
      if (size() > 10) remove();
      add(`${count()} - window click`);
      inc();
    },
    {
      passive: true,
    },
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', 'user-select': 'none' }}>
        <div
          id="content"
          ref={divRef}
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            border: '1px solid red',
          }}
        >
          div
        </div>

        <article
          id="content"
          ref={articleRef}
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            border: '1px solid green',
          }}
        >
          article
        </article>

        <section
          id="content"
          ref={sectionRef}
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            border: '1px solid blue',
          }}
        >
          section
        </section>
      </div>

      <div style={{ display: 'flex', 'flex-direction': 'column', gap: '4px' }}>
        <For each={queue()}>{item => <code>{item}</code>}</For>
      </div>
    </div>
  );
};

export default Demo;
