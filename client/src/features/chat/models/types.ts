export type Role = "user" | "assistant" | "system";

export type MessageStatus = "streaming" | "complete" | "error";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status?: MessageStatus;
};

export type ClientSendPayload = {
  id: string;
  content: string;
};

export type ClientPongPayload = {
  ts: number;
};

export type ServerDeltaPayload = {
  id: string;
  delta: string;
};

export type ServerCompletePayload = {
  id: string;
};

export type ServerErrorPayload = {
  message: string;
  code?: string;
};

export type ServerPingPayload = {
  ts: number;
};
