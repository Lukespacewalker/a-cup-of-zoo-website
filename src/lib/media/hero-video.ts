import type { Response as WorkersResponse } from "@cloudflare/workers-types";

type ByteRange = { start: number; end?: number } | { suffix: number };

function parseRange(value: string): ByteRange | undefined {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value);
  if (!match) return;
  const [, first, last] = match;
  if (!first) return last ? { suffix: Number(last) } : undefined;

  const start = Number(first);
  const end = last ? Number(last) : undefined;
  if (end !== undefined && end < start) return;
  return { start, end };
}

export async function serveHeroVideo<Asset extends Response | WorkersResponse>(
  request: Request,
  fetchAsset: (request: Request) => Promise<Asset>,
): Promise<Asset | Response> {
  const range = request.method === "GET" ? request.headers.get("Range") : null;
  const selection = range ? parseRange(range) : undefined;
  const assetRequest = new Request(request);
  assetRequest.headers.delete("Range");
  assetRequest.headers.delete("If-Range");
  if (selection) assetRequest.headers.set("Accept-Encoding", "identity");

  const asset = await fetchAsset(assetRequest);
  const encoding = asset.headers.get("Content-Encoding");
  const ifRange = request.headers.get("If-Range");
  const matchesIfRange =
    ifRange === null ||
    (ifRange.startsWith('"') && ifRange === asset.headers.get("ETag"));
  if (
    !selection ||
    !matchesIfRange ||
    asset.status !== 200 ||
    asset.headers.get("Content-Type") !== "video/mp4" ||
    (encoding && encoding !== "identity")
  ) {
    return asset;
  }

  // The asset binding can omit Content-Length. Buffer the small, fixed hero
  // files only for single ranges and derive their size from the actual bytes.
  const bytes = new Uint8Array(await asset.arrayBuffer());
  const size = bytes.byteLength;
  const start =
    "suffix" in selection
      ? Math.max(size - selection.suffix, 0)
      : selection.start;
  const headers = new Headers([...asset.headers]);
  headers.set("Accept-Ranges", "bytes");

  if (start >= size) {
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  const end =
    "suffix" in selection
      ? size - 1
      : Math.min(selection.end ?? size - 1, size - 1);
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(bytes.subarray(start, end + 1), { status: 206, headers });
}
