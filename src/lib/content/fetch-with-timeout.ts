import { ContentNotFoundError, ContentUnavailableError } from "./errors";

export function fetchWithTimeout(timeoutMs = 3000): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const parent = init?.signal;
    const onParentAbort = () => controller.abort();
    parent?.addEventListener("abort", onParentAbort);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } catch (error) {
      if (error instanceof ContentNotFoundError || error instanceof ContentUnavailableError) throw error;
      throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
    } finally {
      clearTimeout(timer);
      parent?.removeEventListener("abort", onParentAbort);
    }
  };
}

export async function readCmsJson<T>(response: Response): Promise<T> {
  if (response.status === 404) throw new ContentNotFoundError("ไม่พบข้อมูล");
  if (!response.ok) throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
  try {
    return await response.json() as T;
  } catch {
    throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
  }
}
