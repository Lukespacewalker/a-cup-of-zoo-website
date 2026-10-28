import { ContentNotFoundError, ContentUnavailableError } from "./errors";

export function fetchWithTimeout(timeoutMs = 3000): typeof fetch {
  return async (input, init) => {
    // Keep the deadline active while callers consume the response body too.
    const deadline = AbortSignal.timeout(timeoutMs);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, deadline])
      : deadline;
    try {
      return await fetch(input, { ...init, signal });
    } catch (error) {
      if (
        error instanceof ContentNotFoundError ||
        error instanceof ContentUnavailableError
      )
        throw error;
      throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
    }
  };
}

export async function readCmsJson<T>(response: Response): Promise<T> {
  if (response.status === 404) throw new ContentNotFoundError("ไม่พบข้อมูล");
  if (!response.ok)
    throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
  try {
    return (await response.json()) as T;
  } catch {
    throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
  }
}
