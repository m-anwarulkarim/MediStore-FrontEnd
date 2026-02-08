/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface ClientFetchResponse<T> {
  data: T | null;
  error: {
    message: string;
    details?: any;
    statusText?: string;
  } | null;
  status: number;
}

export async function clientFetch<T = any>(
  url: string,
  options: RequestInit & { queryParams?: Record<string, string | number> } = {},
): Promise<ClientFetchResponse<T>> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!baseURL) {
      return {
        data: null,
        error: {
          message: "API base URL is not configured in environment variables",
        },
        status: 0,
      };
    }

    const urlObj = new URL(url.startsWith("http") ? url : `${baseURL}${url}`);

    if (options.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
      });
    }
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    const response = await fetch(urlObj.toString(), {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorData;
      try {
        errorData = isJson ? await response.json() : await response.text();
      } catch {
        errorData = { message: "Could not parse error response" };
      }

      if (process.env.NODE_ENV === "development") {
        console.error(`[Fetch Error ${response.status}]:`, errorData);
      }

      return {
        data: null,
        error: {
          message: errorData?.message || "Something went wrong",
          details: errorData,
          statusText: response.statusText,
        },
        status: response.status,
      };
    }

    let data: T;
    try {
      if (response.status === 204) {
        data = null as T;
      } else {
        data = isJson ? await response.json() : await response.text();
      }
    } catch (parseError) {
      return {
        data: null,
        error: { message: "Failed to parse server response" },
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[clientFetch Critical Error]:", error);
    }

    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Network or Connection Error",
        details: error,
      },
      status: 0,
    };
  }
}
