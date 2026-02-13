/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export interface ClientFetchResponse<T> {
  data: T | null;
  error: {
    message: string;
    details?: any;
    statusText?: string;
  } | null;
  status: number;
}

const joinUrl = (base: string, path: string) => {
  if (!base) return path;
  if (path.startsWith("http")) return path;

  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

export async function clientFetch<T = any>(
  url: string,
  options: RequestInit & { queryParams?: Record<string, string | number> } = {},
): Promise<ClientFetchResponse<T>> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!baseURL) {
      return {
        data: null,
        error: { message: "NEXT_PUBLIC_BACKEND_URL is not configured" },
        status: 0,
      };
    }

    const finalUrl = new URL(joinUrl(baseURL, url));

    if (options.queryParams) {
      for (const [key, value] of Object.entries(options.queryParams)) {
        finalUrl.searchParams.set(key, String(value));
      }
    }

    const headers = new Headers(options.headers);

    const bodyIsFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    if (options.body && !headers.has("Content-Type") && !bodyIsFormData) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(finalUrl.toString(), {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const parseBody = async () => {
      if (response.status === 204) return null;
      return (isJson ? await response.json() : await response.text()) as T;
    };

    if (!response.ok) {
      const errorData = await parseBody().catch(() => null);

      return {
        data: null,
        error: {
          message: (errorData as any)?.message || "Request failed",
          details: errorData,
          statusText: response.statusText,
        },
        status: response.status,
      };
    }

    const data = await parseBody();

    return { data, error: null, status: response.status };
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[clientFetch Critical Error]:", error);
    }

    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Network/Connection Error",
        details: error,
      },
      status: 0,
    };
  }
}
