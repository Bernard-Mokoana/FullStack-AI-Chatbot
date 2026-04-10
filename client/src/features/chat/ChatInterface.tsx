"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send } from "lucide-react";
import type { ChatInterfaceProps } from "@/types/types";
import { clearChatToken, clearChatName, clearChatMessages } from "@/services/storage/chatStorage";

const connectionTone = {
  connected: {
    label: "Connected",
    badge: "bg-emerald-500/15 text-emerald-700",
    dot: "bg-emerald-500",
  },
  connecting: {
    label: "Connecting",
    badge: "bg-amber-500/15 text-amber-700",
    dot: "bg-amber-500",
  },
  disconnected: {
    label: "Offline",
    badge: "bg-slate-500/15 text-slate-700",
    dot: "bg-slate-500",
  },
  error: {
    label: "Error",
    badge: "bg-rose-500/15 text-rose-700",
    dot: "bg-rose-500",
  },
} as const;

export default function ChatInterface({
  displayName,
  connectionState,
  messages,
  input,
  onInputChange,
  onSubmit,
  isAssistantTyping,
}: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAssistantTyping]);

  const status = useMemo(() => connectionTone[connectionState], [connectionState]);

  const handleBack = (() => {
    clearChatName();
    clearChatToken();
    clearChatMessages();
    router.push("/")
  })

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="flex min-h-screen flex-col">
        <header className="w-full bg-white border-b border-slate-200">
          <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
      
          <div>
            <h2 className="font-semibold text-slate-900">AI Assistant</h2>
            <p className="text-sm text-slate-500">Chatting with {displayName}</p>
          </div>
        </div>

        {/* <button type="button" className="h-2 w-2 rounded-full">logout</button> */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          {status.label}
        </div>
        
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full px-4 py-6 sm:px-6">
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`w-fit max-w-[92%] sm:max-w-[80%] lg:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-900 border border-slate-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>


              {connectionState === "connecting" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-fit max-w-[92%] sm:max-w-[80%] lg:max-w-[70%] px-4 py-3 rounded-2xl bg-white border border-slate-200">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {isAssistantTyping && connectionState === "connected" && (
                <div className="flex justify-start">
                   <div className="w-fit max-w-[92%] sm:max-w-[80%] lg:max-w-[70%] px-4 py-3 rounded-2xl bg-white border border-slate-200"><div className="space-y-2 w-44">
                    <div className="h-3 w-32 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-3 w-40 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-3 w-24 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                    </div>
                    </div>
                  )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="w-full border-t border-slate-200 bg-white">
          <div className="mx-auto w-full px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Type your message..."
                className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
