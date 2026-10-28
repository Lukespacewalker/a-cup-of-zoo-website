import { productDtoSchema, type ProductDto } from "@lukespace-cms/client";
import { assertContentConfig, type ContentConfig } from "./create-gateway";
import { fetchWithTimeout, readCmsJson } from "./fetch-with-timeout";
import { ContentNotFoundError, ContentUnavailableError } from "./errors";
import type { Locale } from "../i18n/locale";

export function listingGateway(
  config: ContentConfig,
  fetchImpl: typeof fetch = fetchWithTimeout(),
) {
  assertContentConfig(config);
  async function read(path: string) {
    try {
      return await readCmsJson<unknown>(
        await fetchImpl(new URL(path, config.cmsBaseUrl), {
          headers: { accept: "application/json" },
        }),
      );
    } catch (error) {
      if (error instanceof ContentNotFoundError) throw error;
      throw new ContentUnavailableError("Listings unavailable");
    }
  }
  function parse(value: unknown): ProductDto {
    const parsed = productDtoSchema.safeParse(value);
    if (!parsed.success || parsed.data.status !== "published")
      throw new ContentUnavailableError("Invalid listing response");
    return parsed.data;
  }
  return {
    async list(locale: Locale): Promise<ProductDto[]> {
      if (config.mode === "fixture") return [];
      const items: ProductDto[] = [];
      for (let offset = 0; offset < 1000; offset += 100) {
        const value = (await read(
          `/api/public/products?locale=${locale}&limit=100&offset=${offset}`,
        )) as { items?: unknown[] };
        if (!value || !Array.isArray(value.items))
          throw new ContentUnavailableError("Invalid listing response");
        items.push(...value.items.map(parse));
        if (value.items.length < 100) break;
      }
      return items;
    },
    async get(locale: Locale, slug: string): Promise<ProductDto | null> {
      if (config.mode === "fixture") return null;
      try {
        return parse(
          await read(
            `/api/public/products/${encodeURIComponent(slug)}?locale=${locale}`,
          ),
        );
      } catch (error) {
        if (error instanceof ContentNotFoundError) return null;
        throw error;
      }
    },
  };
}

export function listingPrice(priceMinor: number | null, locale: Locale) {
  return priceMinor === null
    ? locale === "th"
      ? "สอบถามราคา"
      : "Ask for price"
    : new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-GB", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: priceMinor % 100 ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(priceMinor / 100);
}
export function listingPath(locale: Locale, slug: string) {
  return `${locale === "en" ? "/en" : ""}/farm/${encodeURIComponent(slug)}/`;
}
export function listingImage(url: string) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}
