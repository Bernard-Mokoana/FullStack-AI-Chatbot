import type {
  ClientPongPayload,
  ClientSendPayload,
  ServerCompletePayload,
  ServerDeltaPayload,
  ServerErrorPayload,
  ServerPingPayload,
} from "@/features/chat/models/types";

export const WS_EVENTS = {
  clientSend: "client:message.send",
  clientPong: "client:pong",
  serverDelta: "server:message.delta",
  serverComplete: "server:message.complete",
  serverError: "server:error",
  serverPing: "server:ping",
} as const;

export type OutboundEvent =
  | { type: typeof WS_EVENTS.clientSend; payload: ClientSendPayload }
  | { type: typeof WS_EVENTS.clientPong; payload: ClientPongPayload };

export type InboundEvent =
  | { type: typeof WS_EVENTS.serverDelta; payload: ServerDeltaPayload }
  | { type: typeof WS_EVENTS.serverComplete; payload: ServerCompletePayload }
  | { type: typeof WS_EVENTS.serverError; payload: ServerErrorPayload }
  | { type: typeof WS_EVENTS.serverPing; payload: ServerPingPayload };
