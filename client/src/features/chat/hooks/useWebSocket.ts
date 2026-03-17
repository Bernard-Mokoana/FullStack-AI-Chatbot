"use client";

import { useCallback, useEffect, useRef } from "react";
import { createWebSocketClient } from "@/services/ws/client";
import { nextDelayMs } from "@/services/ws/reconnect";
import { useChatStore } from "@/features/chat/state/chatStore";

type UseWebSocketOptions = {
  url: string;
  enabled?: boolean;
  onMessage?: (message: string) => void;
};

type WebSocketState = {
  send: (message: string) => void;
};

export function useWebSocket({
  url,
  enabled = true,
  onMessage,
}: UseWebSocketOptions): WebSocketState {
  const clientRef = useRef<ReturnType<typeof createWebSocketClient> | null>(
    null
  );
  const reconnectAttempt = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef<UseWebSocketOptions["onMessage"]>(onMessage);
  const { setConnectionStatus } = useChatStore();

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    setConnectionStatus("connecting");
    clientRef.current = createWebSocketClient(url, {
      onOpen: () => {
        reconnectAttempt.current = 0;
        setConnectionStatus("connected");
      },
      onClose: () => {
        setConnectionStatus("disconnected");
        if (!enabled) return;

        const delay = nextDelayMs(reconnectAttempt.current);
        reconnectAttempt.current += 1;
        reconnectTimeout.current = setTimeout(connect, delay);
      },
      onError: () => {
        setConnectionStatus("disconnected");
      },
      onMessage: (message) => onMessageRef.current?.(message),
    });
  }, [enabled, setConnectionStatus, url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      clientRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((message: string) => {
    clientRef.current?.send(message);
  }, []);

  return { send };
}
