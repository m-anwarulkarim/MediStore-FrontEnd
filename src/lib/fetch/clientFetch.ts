/* eslint-disable @typescript-eslint/no-explicit-any */
interface ClientFetchResponse<T> {
  data: T | null;
  error: any;
  status: number;
}

export async function clientFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<ClientFetchResponse<T>> {
  try {
    //  Environment variable check
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseURL) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not configured");
      return {
        data: null,
        error: { message: "API base URL is not configured" },
        status: 0,
      };
    }

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const fullURL = `${baseURL}${url}`;
    if (process.env.NODE_ENV === "development") {
      // console.log(`[clientFetch] ${options.method || "GET"} ${fullURL}`);
    }

    const response = await fetch(fullURL, {
      ...options,
      headers,
      credentials: "include",
    });
    // Content type check
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorData;

      try {
        errorData = isJson
          ? await response.json()
          : { message: await response.text() };
      } catch {
        errorData = {
          message: `HTTP Error ${response.status}: ${response.statusText}`,
        };
      }

      //  Development এ error log
      if (process.env.NODE_ENV === "development") {
        console.error(`[clientFetch Error] ${response.status}:`, errorData);
      }

      return {
        data: null,
        error: errorData,
        status: response.status,
      };
    }

    // Response parsing with error handling
    let data;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
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
  } catch (error) {
    console.error("Client fetch error:", error);
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Network error",
        originalError: error,
      },
      status: 0,
    };
  }
}
