export type Locale = "th" | "en";
export const bilingualPaths = ["/", "/animals/", "/activities/", "/menu/", "/visit/"];
export const localeFromPath = (path: string): Locale => path.startsWith("/en/") ? "en" : "th";
export const translator = (locale: Locale) => (th: string, en: string) => locale === "en" ? en : th;

export function basePath(path: string) {
  return path.startsWith("/en/") ? path.slice(3) : path;
}

export function localePath(path: string, locale: Locale) {
  const [pathname, hash] = path.split("#");
  const base = basePath(pathname);
  const target = bilingualPaths.includes(base) ? (locale === "en" ? `/en${base}` : base) : base;
  return hash ? `${target}#${hash}` : target;
}

export function languageAlternates(path: string, origin: URL | string) {
  const base = basePath(path);
  return bilingualPaths.includes(base) ? (["th", "en"] as const).map(locale => ({
    locale, url: new URL(localePath(base, locale), origin).href,
  })) : [];
}
