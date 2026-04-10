"use client";

import { useState } from "react";
import { createChatSession } from "@/services/chat/chatApi";
import { setChatName, setChatToken } from "@/services/storage/chatStorage";

export default function Home() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const session = await createChatSession(trimmedName);
      setChatName(trimmedName);
      setChatToken(session.token);
      // router.push("/chat");
      window.location.href = "/chat";
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI",
        background:
          "radial-gradient(circle at 20% 20%, #f5f7ff 0%, #ffffff 45%, #f7fbff 100%)",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "16px",
          padding: "2.5rem",
          background: "#ffffff",
          boxShadow:
            "0 30px 70px rgba(15, 23, 42, 0.12), 0 6px 18px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: "0.5rem",
            }}
          >
            AI Chatbot
          </p>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>
            Enter your name to continue
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#475569" }}>Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Itachi Uchiha"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid #cbd5f5",
                fontSize: "1rem",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#ffffff",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.2)",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Creating session..." : "Continue to chat"}
          </button>
        </form>
      </section>
    </main>
  );
}
