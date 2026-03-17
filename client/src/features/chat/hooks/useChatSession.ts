"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "@/features/chat/state/chatStore";
import type { Message } from "@/features/chat/models/types";
import { useWebSocket } from "@/features/chat/hooks/useWebSocket";
import { WS_URL, API_URL } from "@/lib/env";
import { createChatSession } from "@/services/chat/session";
import { parseServerMessage } from "@/features/chat/utils/parseServerMessage";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useChatSession(name?: string) {
  const { messages, connectionStatus, addMessage, setMessageStatus } =
    useChatStore();
  const [token, setToken] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const sendRef = useRef<(message: string) => void>(() => {});

  useEffect(() => {
    if (!name) return;
    let mounted = true;
    createChatSession(name, API_URL)
      .then((session) => {
        if (!mounted) return;
        setToken(session.token);
      })
      .catch(() => {
        if (!mounted) return;
        setSessionError("Unable to start chat session.");
      });

    return () => {
      mounted = false;
    };
  }, [name]);

  const handleInbound = useCallback(
    (rawMessage: string) => {
      const content = parseServerMessage(rawMessage);
      if (!content) return;

      const assistantMessage: Message = {
        id: createId(),
        role: "assistant",
        content,
        createdAt: Date.now(),
        status: "complete",
      };

      addMessage(assistantMessage);
    },
    [addMessage]
  );

  const wsUrl = token ? `${WS_URL}?token=${token}` : WS_URL;
  const { send } = useWebSocket({
    url: wsUrl,
    enabled: Boolean(token) && !sessionError,
    onMessage: handleInbound,
  });

  sendRef.current = send;

  const sendMessage = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: createId(),
        role: "user",
        content,
        createdAt: Date.now(),
        status: "complete",
      };

      addMessage(userMessage);
      setMessageStatus(userMessage.id, "complete");
      sendRef.current(content);
    },
    [addMessage, setMessageStatus]
  );

  return useMemo(
    () => ({
      messages,
      connectionStatus,
      sendMessage,
      sessionError,
    }),
    [messages, connectionStatus, sendMessage, sessionError]
  );
}
