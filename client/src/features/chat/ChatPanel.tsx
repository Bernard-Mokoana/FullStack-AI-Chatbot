"use client";

import { useEffect, useRef, useState } from "react";
import { createChatSession, refreshChatSession } from "@/services/chat/chatApi";
import { createChatSocket } from "@/services/ws/chatSocket";
import {
  getChatToken,
  setChatToken,
  clearChatToken,
  getChatMessages,
  setChatMessages,
  clearChatMessages,
} from "@/services/storage/chatStorage";
import ChatInterface from "@/features/chat/ChatInterface";
import type { ChatMessage, ChatPanelProps } from "@/types/types";

export default function ChatPanel({ displayName }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
  const stored = getChatMessages<ChatMessage[]>();
  return stored ?? [];
});

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  const parseHistoryMessage = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed.toLowerCase().startsWith("human:")) {
      return { role: "user" as const, content: trimmed.replace(/^human:\s*/i, "") };
    }
    if (trimmed.toLowerCase().startsWith("bot:")) {
      return { role: "assistant" as const, content: trimmed.replace(/^bot:\s*/i, "") };
    }
    return { role: "assistant" as const, content: trimmed };
  };

  useEffect(() => {
    let alive = true;

    async function initSession() {
      setConnectionState("connecting");
      try {
        const existingToken = getChatToken();

        if (existingToken) {
          const history = await refreshChatSession(existingToken);
          if (!alive) return;

          socketRef.current = createChatSocket(existingToken, (message: string) => {
            setIsAssistantTyping(false);
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: "assistant", content: message },
            ]);
          });
          socketRef.current.onopen = () => setConnectionState("connected");
          socketRef.current.onclose = () => {
            setConnectionState("disconnected");
            setIsAssistantTyping(false);
          };
          socketRef.current.onerror = () => {
            setConnectionState("error");
            setIsAssistantTyping(false);
          };

          if (history?.messages?.length) {
            const mapped = history.messages.map((m: any) => {
              const parsed = parseHistoryMessage(m.msg ?? "");
              return {
                id: m.id ?? crypto.randomUUID(),
                role: parsed.role,
                content: parsed.content,
              };
            });

            setMessages((prev) => (prev.length ? prev : mapped));

          }

          return;
        }

        const session = await createChatSession(displayName);
        if (!alive) return;

        setChatToken(session.token);

        socketRef.current = createChatSocket(session.token, (message) => {
          setIsAssistantTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", content: message },
          ]);
        });
        socketRef.current.onopen = () => setConnectionState("connected");
        socketRef.current.onclose = () => {
          setConnectionState("disconnected");
          setIsAssistantTyping(false);
        };
        socketRef.current.onerror = () => {
          setConnectionState("error");
          setIsAssistantTyping(false);
        };
      } catch (error) {
        clearChatToken();
        clearChatMessages();
        console.error("Failed to init chat session", error);
        setConnectionState("error");
      }
    }

    initSession();

    return () => {
      alive = false;
      socketRef.current?.close();
    };
  }, [displayName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(trimmed);
    }
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ]);

    setIsAssistantTyping(true);

    setInput("");
  };

  return (
    <ChatInterface
      displayName={displayName}
      connectionState={connectionState}
      messages={messages}
      input={input}
      onInputChange={setInput}
      onSubmit={handleSubmit}
      isAssistantTyping={isAssistantTyping}
    />
  );
}
