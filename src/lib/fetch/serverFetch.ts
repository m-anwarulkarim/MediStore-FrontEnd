/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

interface ServerFetchResponse<T> {
  data: T | null;
  error: any;
  status: number;
}

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }

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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headers = {
      "Content-Type": "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }),
      ...(options.headers || {}),
    };

    const baseUrl = getBaseUrl();
    const finalUrl = new URL(normalizePath(url), baseUrl).toString();

    const response = await fetch(finalUrl, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const errorData = isJson
        ? await response.json().catch(() => ({}))
        : { message: await response.text() };

      return {
        data: null,
        error: errorData,
        status: response.status,
      };
    }

    const data = isJson ? await response.json() : await response.text();

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error("Server fetch error:", error);

    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 500,
    };
  }
}
