import { configuredSite } from "./metadata";

// Public search visibility is explicit and independent of the CMS rollout.
export function canIndex(url: URL, site: URL | undefined, enabled: boolean, status = 200) {
  const canonical = configuredSite(site);
  if (!enabled || !canonical || canonical.protocol !== "https:" || url.protocol !== "https:" || url.port || status < 200 || status >= 300) return false;
  if (/^\/font-preview(?:\/|$)/.test(url.pathname)) return false;
  const host = canonical.hostname.replace(/^www\./, "");
  return url.hostname === host || url.hostname === `www.${host}`;
}
