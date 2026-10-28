import { expect, test } from "bun:test";
import { canIndex } from "../../src/lib/seo/indexing";

const site = new URL("https://acupofzoo.com");
test("enabled shop domains can be crawled independently of the CMS content source", () => {
  for (const host of ["acupofzoo.com", "www.acupofzoo.com"]) {
    expect(canIndex(new URL(`https://${host}/en/club/`), site, true)).toBe(
      true,
    );
  }
});
test("preview, local, disabled, missing-domain and error pages remain unindexable", () => {
  for (const url of [
    "http://127.0.0.1:4321/",
    "https://a-cup-of-zoo-preview.a-cup-of-zoo-website.workers.dev/",
    "https://acupofzoo.com.evil.example/",
    "http://acupofzoo.com/",
    "https://acupofzoo.com/font-preview/",
  ]) {
    expect(canIndex(new URL(url), site, true)).toBe(false);
  }
  expect(canIndex(site, site, false)).toBe(false);
  expect(canIndex(site, undefined, true)).toBe(false);
  expect(canIndex(site, new URL("https://acupofzoo.invalid"), true)).toBe(
    false,
  );
  expect(canIndex(site, site, true, 404)).toBe(false);
  expect(canIndex(site, site, true, 503)).toBe(false);
});
