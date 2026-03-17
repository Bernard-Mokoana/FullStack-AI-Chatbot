type WebSocketClientHandlers = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: string) => void;
};

type WebSocketClient = {
  send: (message: string) => void;
  close: () => void;
};

export function createWebSocketClient(
  url: string,
  handlers: WebSocketClientHandlers
): WebSocketClient {
  const socket = new WebSocket(url);

  socket.addEventListener("open", () => handlers.onOpen?.());
  socket.addEventListener("close", (event) => handlers.onClose?.(event));
  socket.addEventListener("error", (event) => handlers.onError?.(event));
  socket.addEventListener("message", (event) => {
    if (typeof event.data !== "string") return;
    handlers.onMessage?.(event.data);
  });

  return {
    send: (message) => {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(message);
    },
    close: () => socket.close(),
  };
}
