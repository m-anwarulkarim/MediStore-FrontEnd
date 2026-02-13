/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export interface ServerFetchResponse<T> {
  data: T | null;
  error: any;
  status: number;
}

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  return base.endsWith("/") ? base : `${base}/`;
};

const normalizePath = (path: string) => {
  if (!path) return "";
  return path.startsWith("/") ? path.slice(1) : path;
};

export async function serverFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<ServerFetchResponse<T>> {
  try {
    const baseUrl = getBaseUrl();
    const finalUrl = new URL(normalizePath(url), baseUrl).toString();

    const headers = new Headers(options.headers);

    const bodyIsFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    if (options.body && !headers.has("Content-Type") && !bodyIsFormData) {
      headers.set("Content-Type", "application/json");
    }

    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    const response = await fetch(finalUrl, {
      ...options,
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
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
      return { data: null, error: errorData, status: response.status };
    }

    const data = await parseBody();
    return { data, error: null, status: response.status };
  } catch (error) {
    console.error("Server fetch error:", error);

    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 500,
    };
  }
}
