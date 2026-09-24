const mapsHosts = new Set(["maps.app.goo.gl", "goo.gl", "maps.google.com", "www.google.com", "google.com"]);
const facebookHosts = new Set(["facebook.com", "www.facebook.com", "m.facebook.com"]);

export function allowedExternalUrl(value: string | null, kind: "maps" | "facebook") {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hosts = kind === "maps" ? mapsHosts : facebookHosts;
    if (url.protocol !== "https:" || !hosts.has(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function phoneHref(phoneE164: string | null) {
  if (!phoneE164 || !/^\+[1-9]\d{7,14}$/.test(phoneE164)) return null;
  return `tel:${phoneE164}`;
}
