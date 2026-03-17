export function parseServerMessage(raw: string): string {
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw) as { msg?: string; message?: string };
    if (typeof parsed?.msg === "string") return parsed.msg;
    if (typeof parsed?.message === "string") return parsed.message;
  } catch {
    // Not JSON.
  }

  const match = raw.match(/['"]msg['"]\s*:\s*['"]([\s\S]*?)['"]\s*}/);
  if (match?.[1]) return match[1];

  return raw;
}
