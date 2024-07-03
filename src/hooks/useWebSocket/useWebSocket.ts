import { getRetry } from '@/utils/helpers';
import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

export type UseWebSocketUrl = string | (() => string);

export interface UseWebSocketOptions {
  onConnected?: (webSocket: WebSocket) => void;
  onDisconnected?: (event: CloseEvent, webSocket: WebSocket) => void;
  onError?: (event: Event, webSocket: WebSocket) => void;
  onMessage?: (event: MessageEvent, webSocket: WebSocket) => void;
  retry?: boolean | number;
  protocols?: Array<'soap' | 'wasm'>;
}

export type UseWebSocketStatus =
  | 'connecting'
  | 'failed'
  | 'connected'
  | 'disconnected';

export interface UseWebSocketReturn {
  status: Accessor<UseWebSocketStatus>;
  close: WebSocket['close'];
  send: WebSocket['send'];
  open: () => void;
  client?: WebSocket;
}

/**
 * @name useWebSocket
 * @description - Hook that connects to a WebSocket server and handles incoming and outgoing messages
 * @category Network
 *
 * @param {UseWebSocketUrl} url The URL of the WebSocket server
 * @param {(webSocket: WebSocket) => void} [options.onConnected] The callback function that is called when the WebSocket connection is established
 * @param {(event: CloseEvent, webSocket: WebSocket) => void} [options.onDisconnected] The callback function that is called when the WebSocket connection is closed
 * @param {(event: Event, webSocket: WebSocket) => void} [options.onError] The callback function that is called when an error occurs
 * @param {(event: MessageEvent, webSocket: WebSocket) => void} [options.onMessage] The callback function that is called when a message is received
 * @param {boolean | number} [options.retry] The number of times to retry the connection
 * @param {Array<'soap' | 'wasm'>} [options.protocols] The list of protocols to use
 * @returns {UseWebSocketReturn} An object with the status, close, send, open, and ws properties
 *
 * @example
 * const { status, close, send, open, client } = useWebSocket('url');
 */
export const useWebSocket = (
  url: UseWebSocketUrl,
  options?: UseWebSocketOptions,
): UseWebSocketReturn => {
  let websocket: WebSocket | undefined;
  let retryCountRef = options?.retry ? getRetry(options.retry) : 0;
  let explicityCloseRef = false;

  const [status, setStatus] = createSignal<UseWebSocketStatus>('connecting');

  const send = (data: string | Blob | ArrayBufferLike | ArrayBufferView) =>
    websocket?.send(data);

  const close = () => {
    explicityCloseRef = true;
    websocket?.close();
  };

  const init = () => {
    websocket = new WebSocket(
      typeof url === 'function' ? url() : url,
      options?.protocols,
    );
    setStatus('connecting');

    const webSocket = websocket;
    if (!webSocket) return;

    webSocket.onopen = () => {
      setStatus('connected');
      options?.onConnected?.(webSocket);
    };

    webSocket.onerror = event => {
      setStatus('failed');
      options?.onError?.(event, webSocket);
    };

    webSocket.onmessage = event => options?.onMessage?.(event, webSocket);

    webSocket.onclose = event => {
      setStatus('disconnected');
      options?.onDisconnected?.(event, webSocket);
      if (explicityCloseRef) return;

      if (retryCountRef > 0) {
        retryCountRef -= 1;
        return init();
      }
      retryCountRef = options?.retry ? getRetry(options.retry) : 0;
    };
  };

  createEffect(() => {
    init();

    onCleanup(() => {
      if (!websocket) return;
      websocket.close();
      websocket = undefined;
    });
  });

  const open = () => {
    explicityCloseRef = false;
    init();
  };

  return { client: websocket, close, open, send, status };
};
