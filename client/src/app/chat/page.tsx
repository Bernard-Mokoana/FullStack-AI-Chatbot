"use client";

import { useRef, useState } from "react";
import { ChatShell } from "@/features/chat/components/ChatShell";
import { Composer } from "@/features/chat/components/Composer";
import { ConnectionBadge } from "@/features/chat/components/ConnectionBadge";
import { MessageList } from "@/features/chat/components/MessageList";
import { TypingIndicator } from "@/features/chat/components/TypingIndicator";
import { useAutoScroll } from "@/features/chat/hooks/useAutoScroll";
import { useChatSession } from "@/features/chat/hooks/useChatSession";

export default function ChatPage() {
  const [nameInput, setNameInput] = useState("");
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const { messages, connectionStatus, sendMessage, sessionError } =
    useChatSession(submittedName ?? undefined);
  const listRef = useRef<HTMLDivElement>(null);
  const isStreaming = messages.some((message) => message.status === "streaming");

  useAutoScroll(listRef, [messages.length]);

  const handleNameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSubmittedName(trimmed);
  };

  return (
    <ChatShell
      header={
        <>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">AI Chat</h1>
            <p className="text-xs text-zinc-500">WebSocket streaming enabled</p>
          </div>
          <ConnectionBadge status={connectionStatus} />
        </>
      }
    >
      {!submittedName ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <form
            onSubmit={handleNameSubmit}
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              Enter your name
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              We use your name to start a new chat session.
            </p>
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your name"
              className="mt-4 w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Start Chat
            </button>
          </form>
        </div>
      ) : null}
      {sessionError ? (
        <div className="px-6 py-4 text-sm text-rose-600">{sessionError}</div>
      ) : null}
      {submittedName ? (
        <>
          <MessageList messages={messages} containerRef={listRef} />
          {isStreaming ? <TypingIndicator /> : null}
          <Composer
            onSend={sendMessage}
            disabled={connectionStatus !== "connected" || Boolean(sessionError)}
          />
        </>
      ) : null}
    </ChatShell>
  );
}
