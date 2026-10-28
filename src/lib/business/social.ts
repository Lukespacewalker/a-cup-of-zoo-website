import { allowedExternalUrl } from "./links";

// Instagram and TikTok handles supplied by the owner on 27 October 2026.
export const instagramUrl = "https://www.instagram.com/acupofzoo/";
export const tiktokUrl = "https://www.tiktok.com/@acupofzoo";

export function socialProfiles(facebookUrl: string | null | undefined) {
  const facebook = allowedExternalUrl(facebookUrl ?? null, "facebook");
  return [
    ...(facebook ? [{ id: "facebook" as const, name: "Facebook", handle: "A Cup of Zoo", url: facebook }] : []),
    { id: "instagram" as const, name: "Instagram", handle: "@acupofzoo", url: instagramUrl },
    { id: "tiktok" as const, name: "TikTok", handle: "@acupofzoo", url: tiktokUrl },
  ];
}
