type ApiResponse<T> = { success: true; data: T };
type ApiError = { success: false; error: { statusCode: number; message: string | string[] } };

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const DEFAULT_TIMEOUT_MS = 15_000;

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
      signal: options?.signal ?? controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson?.error?.message) {
          msg = Array.isArray(errorJson.error.message)
            ? errorJson.error.message.join(', ')
            : errorJson.error.message;
        }
      } catch {
        // response body wasn't JSON
      }
      throw new ApiRequestError(res.status, msg);
    }

    const json: ApiResponse<T> | ApiError = await res.json();
    if (!json.success) {
      const msg = Array.isArray(json.error.message)
        ? json.error.message.join(', ')
        : json.error.message;
      throw new ApiRequestError(json.error.statusCode, msg);
    }
    return json.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiRequestError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError(408, `Request timed out after ${DEFAULT_TIMEOUT_MS}ms: ${url}`);
    }
    throw new ApiRequestError(0, `Network error: ${(error as Error).message} (url: ${url})`);
  }
}
