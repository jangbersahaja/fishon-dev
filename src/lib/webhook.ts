export async function sendWithRetry(
  url: string,
  body: unknown,
  options?: {
    headers?: Record<string, string>;
    attempts?: number;
    baseDelayMs?: number;
  }
) {
  const attempts = Math.max(1, options?.attempts ?? 3);
  const baseDelay = options?.baseDelayMs ?? 300;

  let lastError: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(options?.headers ?? {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) return true;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastError = e;
    }
    // backoff
    const delay = baseDelay * Math.pow(2, i);
    await new Promise((r) => setTimeout(r, delay));
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn("webhook failed after retries", {
      url,
      error: (lastError as any)?.message,
    });
  }
  return false;
}
