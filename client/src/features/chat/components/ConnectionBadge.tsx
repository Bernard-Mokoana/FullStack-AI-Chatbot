"use client";

import type { ConnectionStatus } from "@/features/chat/state/chatStore";

const STATUS_STYLE: Record<ConnectionStatus, string> = {
  connected: "bg-emerald-100 text-emerald-800",
  connecting: "bg-amber-100 text-amber-800",
  disconnected: "bg-rose-100 text-rose-800",
};

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLE[status]
      }`}
    >
      {status}
    </span>
  );
}
