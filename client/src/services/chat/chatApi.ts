import { httpClient } from "../httpClient";

export async function createChatSession(name: string) {
  const response = await httpClient.post("/token", null, {
    params: { name },
  });
  return response.data;
}

export async function refreshChatSession(token: string) {
  const response = await httpClient.get("/refresh_token", {
    params: { token },
  });
  return response.data;
}
