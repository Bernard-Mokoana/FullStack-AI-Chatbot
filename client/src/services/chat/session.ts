export type ChatSession = {
  token: string;
  name: string;
  messages: unknown[];
};

export async function createChatSession(
  name: string,
  apiUrl: string
): Promise<ChatSession> {
  const response = await fetch(`${apiUrl}/token?name=${encodeURIComponent(name)}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create chat session");
  }

  return (await response.json()) as ChatSession;
}
