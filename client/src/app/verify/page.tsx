import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function VerifyPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  if (user.email_verified) {
    redirect("/chat");
  }

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
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Verify your email</h1>
          <p style={{ marginTop: "0.75rem", color: "#475569" }}>
            We sent a verification link to your email address. Please confirm
            it before continuing.
          </p>
        </div>
        <div
          style={{
            padding: "1rem",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#475569",
            marginBottom: "1.5rem",
          }}
        >
          Signed in as <strong>{user.email ?? "your email"}</strong>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="/chat"
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.2)",
            }}
          >
            I have verified
          </a>
          <a
            href="/auth/logout"
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 600,
              border: "1px solid #cbd5f5",
              boxShadow: "0 6px 12px rgba(15, 23, 42, 0.08)",
            }}
          >
            Log out
          </a>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
          If the email is missing, check your spam folder or resend the
          verification email from Auth0.
        </p>
      </section>
    </main>
  );
}
