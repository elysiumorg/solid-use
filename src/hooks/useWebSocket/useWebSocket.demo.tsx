import { createSignal } from 'solid-js';
import { useWebSocket } from './useWebSocket';

type Message = {
  text: string;
  type: 'client' | 'server';
  date: Date;
};

const Demo = () => {
  const [messageInput, setMessageInput] = createSignal('');

  const [messages, setMessages] = createSignal<Message[]>([
    { text: 'Connecting to chat...', type: 'server', date: new Date() },
  ]);

  const webSocket = useWebSocket('wss://echo.websocket.org', {
    onConnected: webSocket =>
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: `Connected to ${webSocket.url}`,
          type: 'server',
          date: new Date(),
        },
      ]),
    onMessage: event =>
      setMessages(prevMessages => [
        ...prevMessages,
        { text: event.data as string, type: 'server', date: new Date() },
      ]),
    onDisconnected: () =>
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Disconnected', type: 'server', date: new Date() },
      ]),
  });

  return (
    <>
      <p>
        Status: <code>{webSocket.status()}</code>
      </p>

      <div>
        {messages().map(message => (
          <div>
            <span>
              <code>
                {message.date.toLocaleTimeString()} {message.type}
              </code>{' '}
            </span>
            {message.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={messageInput()}
        onChange={e => setMessageInput(e.target.value)}
      />
      <button
        disabled={webSocket.status() !== 'connected'}
        type="button"
        onClick={() => {
          const message = messageInput();
          setMessages(prev => [
            ...prev,
            { text: messageInput(), type: 'client', date: new Date() },
          ]);
          webSocket.send(message);
          setMessageInput('');
        }}
      >
        Send
      </button>
      {webSocket.status() === 'connected' && (
        <button type="button" onClick={() => webSocket.close()}>
          Disconnect
        </button>
      )}
      {webSocket.status() === 'disconnected' && (
        <button type="button" onClick={() => webSocket.open()}>
          Connect
        </button>
      )}
    </>
  );
};

export default Demo;
