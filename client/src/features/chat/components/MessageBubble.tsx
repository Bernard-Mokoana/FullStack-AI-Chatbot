"use client";

import type { Message } from "@/features/chat/models/types";

const ROLE_STYLES: Record<Message["role"], string> = {
  user: "self-end bg-zinc-900 text-white",
  assistant: "self-start bg-zinc-100 text-zinc-900",
  system: "self-center bg-amber-100 text-amber-900",
};

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
        ROLE_STYLES[message.role]
      }`}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.status === "streaming" && (
        <span className="mt-2 block text-xs text-zinc-500">Streaming...</span>
      )}
    </div>
  );
}
