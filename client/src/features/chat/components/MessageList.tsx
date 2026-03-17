"use client";

import type { Message } from "@/features/chat/models/types";
import type { RefObject } from "react";
import { MessageBubble } from "@/features/chat/components/MessageBubble";

type MessageListProps = {
  messages: Message[];
  containerRef?: RefObject<HTMLDivElement>;
};

export function MessageList({ messages, containerRef }: MessageListProps) {
  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-4"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
