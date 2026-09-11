const API_BASE_URL =
  import.meta.env.VITE_IRIS_API_BASE_URL ?? "/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export class IrisApiError<T = unknown> extends Error {
  status: number;
  payload: T | null;

  constructor(status: number, payload: T | null) {
    super(`IRIS API error ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

export async function irisRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();

  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new IrisApiError(response.status, payload);
  }

  return payload as T;
}