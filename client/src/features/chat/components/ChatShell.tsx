"use client";

import type { ReactNode } from "react";

export function ChatShell({ header, children }: { header?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      {header ? (
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
          {header}
        </header>
      ) : null}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
