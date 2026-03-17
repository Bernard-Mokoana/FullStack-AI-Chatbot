import { create } from "zustand";
import type { Message, MessageStatus } from "@/features/chat/models/types";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

type ChatState = {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  addMessage: (message: Message) => void;
  appendToMessage: (id: string, delta: string) => void;
  setMessageStatus: (id: string, status: MessageStatus) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  connectionStatus: "disconnected",
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  appendToMessage: (id, delta) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? { ...message, content: `${message.content}${delta}` }
          : message
      ),
    })),
  setMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, status } : message
      ),
    })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  reset: () => set({ messages: [], connectionStatus: "disconnected" }),
}));
