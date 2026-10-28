export * from "./generated/index";

export type CmsClientOptions = {
  baseUrl: string;
  fetch?: typeof fetch;
  bearerToken?: string;
};

export class CmsClientError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

/** Escapes individual API path segments without treating user content as a URL. */
export function cmsPath(...segments: readonly string[]) {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

/** Resolves a public media reference while preserving absolute CDN URLs. */
export function resolveCmsUrl(baseUrl: string, reference: string) {
  return new URL(reference, baseUrl).toString();
}

/** Runtime-neutral REST client. Project selection and authentication remain caller-owned. */
export function createCmsClient(options: CmsClientOptions) {
  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await (options.fetch ?? fetch)(resolveCmsUrl(options.baseUrl, path), {
      ...init,
      headers: {
        accept: "application/json",
        ...(init?.body instanceof FormData ? {} : { "content-type": "application/json" }),
        ...(options.bearerToken ? { authorization: `Bearer ${options.bearerToken}` } : {}),
        ...init?.headers,
      },
    });
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | T | null;
    if (!response.ok) throw new CmsClientError(response.status, (payload as { error?: { message?: string } } | null)?.error?.message ?? `Request failed (${response.status})`);
    return payload as T;
  };
  return { request };
}
