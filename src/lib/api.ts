export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
