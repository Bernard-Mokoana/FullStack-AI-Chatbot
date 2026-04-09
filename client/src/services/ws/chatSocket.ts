type MessageHandler = (message: string) => void;
type ErrorHandler = (event: Event) => void;

const rawWsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;

if (!rawWsBaseUrl) {
  throw new Error("WS_URL is not set");
}

const wsBaseUrl = rawWsBaseUrl.replace(/\/chat\/?$/, "");

export function createChatSocket(
  token: string,
  onMessage: MessageHandler,
  onError?: ErrorHandler
) {
  const socket = new WebSocket(`${wsBaseUrl}/chat?token=${token}`);

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed?.msg ?? "");
    } catch (error) {
       onMessage(event.data);
       console.error(error)
    }
  };

  socket.onerror = (event) => {
    if (onError) {
      onError(event);
    }
  };

  return socket;
}
