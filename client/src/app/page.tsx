import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
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
              AI Chabot
            </p>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>Welcome back</h1>
            <p style={{ marginTop: "0.75rem", color: "#475569" }}>
              Sign in to start chatting and get help with questions or
              troubleshooting.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href="/auth/login?screen_hint=signup"
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
              Create account
            </a>
            <a
              href="/auth/login"
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
              Log in
            </a>
          </div>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            New here? Create an account. Already have one? Log in.
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
            Secured with Auth0.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2.5rem",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI",
        background:
          "radial-gradient(circle at 10% 10%, #f5f7ff 0%, #ffffff 50%, #f7fbff 100%)",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "16px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
        }}
      >
        <p style={{ color: "#64748b", marginTop: 0 }}>Signed in</p>
        <h1 style={{ margin: "0.25rem 0 1.25rem" }}>
          {user.name ?? user.email ?? "User"}
        </h1>
        <div
          style={{
            display: "grid",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            color: "#334155",
          }}
        >
          <div>
            <strong>Email:</strong> {user.email ?? "Not provided"}
          </div>
          <div>
            <strong>User ID:</strong> {user.sub ?? "Not available"}
          </div>
        </div>
        <details style={{ marginBottom: "1.5rem" }}>
          <summary style={{ cursor: "pointer", color: "#475569" }}>
            View raw session payload
          </summary>
          <pre
            style={{
              marginTop: "0.75rem",
              padding: "1rem",
              borderRadius: "10px",
              background: "#f8fafc",
              overflowX: "auto",
              fontSize: "0.85rem",
            }}
          >
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
        <a
          href="/auth/logout"
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            background: "#0f172a",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Log out
        </a>
      </section>
    </main>
  );
}
