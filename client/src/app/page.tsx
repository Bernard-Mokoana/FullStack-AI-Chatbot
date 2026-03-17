export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <main className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">AI Chatbot</h1>
        <p className="mt-3 text-base text-zinc-600">
          Launch the WebSocket chat experience.
        </p>
        <a
          href="/chat"
          className="mt-8 inline-flex items-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Open Chat
        </a>
      </main>
    </div>
  );
}
