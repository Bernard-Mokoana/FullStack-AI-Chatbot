import type { FormEvent } from "react";

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatInterfaceProps = {
  displayName: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  recentChats: string[];
  connectionState: ConnectionState;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isAssistantTyping: boolean;
};

export type ChatPanelProps = {
  displayName: string;
};
