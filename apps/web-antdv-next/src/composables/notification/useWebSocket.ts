import type {
  BackendMessage,
  UseWebSocketOptions,
  UseWebSocketReturn,
  WebSocketStatus,
} from './types';

import { onUnmounted, ref } from 'vue';

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30_000,
    heartbeatTimeout = 10_000,
  } = options;

  const getUrl = typeof url === 'function' ? url : () => url;

  const status = ref<WebSocketStatus>('disconnected');
  let ws: null | WebSocket = null;
  let reconnectAttempts = 0;
  let reconnectTimer: null | ReturnType<typeof setTimeout> = null;
  let heartbeatTimer: null | ReturnType<typeof setTimeout> = null;
  let heartbeatTimeoutTimer: null | ReturnType<typeof setTimeout> = null;

  const messageHandlers = new Set<(msg: BackendMessage) => void>();
  const openHandlers = new Set<() => void>();
  const closeHandlers = new Set<() => void>();
  const errorHandlers = new Set<(error: Event) => void>();

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatTimer = setTimeout(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING' }));
        heartbeatTimeoutTimer = setTimeout(() => {
          ws?.close();
        }, heartbeatTimeout);
      }
    }, heartbeatInterval);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (heartbeatTimeoutTimer) {
      clearTimeout(heartbeatTimeoutTimer);
      heartbeatTimeoutTimer = null;
    }
  }

  function connect() {
    const wsUrl = getUrl();
    if (
      ws?.readyState === WebSocket.OPEN ||
      ws?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    status.value = 'connecting';
    reconnectAttempts = 0;

    try {
      ws = new WebSocket(wsUrl);

      ws.addEventListener('open', () => {
        status.value = 'connected';
        reconnectAttempts = 0;
        openHandlers.forEach((handler) => handler());
        startHeartbeat();
      });

      ws.addEventListener('message', (event) => {
        const dataStr = event.data as string;
        try {
          const data = JSON.parse(dataStr);
          if (data?.type === 'PONG') {
            if (heartbeatTimeoutTimer) {
              clearTimeout(heartbeatTimeoutTimer);
              heartbeatTimeoutTimer = null;
            }
            startHeartbeat();
            return;
          }
          messageHandlers.forEach((handler) => handler(data));
        } catch (error) {
          console.error('[WebSocket] Parse error:', error);
          // ignore parse errors for non-json messages
        }
      });

      ws.addEventListener('close', () => {
        status.value = 'disconnected';
        stopHeartbeat();
        closeHandlers.forEach((handler) => handler());
        maybeReconnect();
      });

      ws.addEventListener('error', (event) => {
        status.value = 'error';
        stopHeartbeat();
        errorHandlers.forEach((handler) => handler(event));
      });
    } catch {
      status.value = 'error';
    }
  }

  function disconnect() {
    stopHeartbeat();
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    reconnectAttempts = maxReconnectAttempts;
    ws?.close();
    ws = null;
    status.value = 'disconnected';
  }

  function send(data: unknown) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function maybeReconnect() {
    if (!reconnect || reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    const delay = Math.min(reconnectInterval * 2 ** reconnectAttempts, 30_000);
    reconnectAttempts++;

    reconnectTimer = setTimeout(() => {
      connect();
    }, delay);
  }

  function onMessage(handler: (msg: BackendMessage) => void) {
    messageHandlers.add(handler);
    return () => messageHandlers.delete(handler);
  }

  function onOpen(handler: () => void) {
    openHandlers.add(handler);
    return () => openHandlers.delete(handler);
  }

  function onClose(handler: () => void) {
    closeHandlers.add(handler);
    return () => closeHandlers.delete(handler);
  }

  function onError(handler: (error: Event) => void) {
    errorHandlers.add(handler);
    return () => errorHandlers.delete(handler);
  }

  onUnmounted(() => {
    disconnect();
    messageHandlers.clear();
    openHandlers.clear();
    closeHandlers.clear();
    errorHandlers.clear();
  });

  return {
    status,
    connect,
    disconnect,
    send,
    onMessage,
    onOpen,
    onClose,
    onError,
  };
}
