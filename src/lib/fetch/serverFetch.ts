/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

interface ServerFetchResponse<T> {
  data: T | null;
  error: any;
  status: number;
}

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      {
        ...options,
        headers,
        credentials: "include",
      },
    );

    // Response parsing
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
