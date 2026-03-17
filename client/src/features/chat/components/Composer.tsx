"use client";

import { useState } from "react";

type ComposerProps = {
  onSend: (content: string) => void;
  disabled?: boolean;
};

export function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-zinc-200 bg-white px-6 py-4"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        disabled={disabled}
      />
      <button
        type="submit"
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
}
