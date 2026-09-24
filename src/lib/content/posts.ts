import type { PostDto } from "@lukespace-cms/client";
import type { SiteEnvironment } from "./create-gateway";

export function isDemoPost(post: PostDto) {
  return post.translations.some((translation) => translation.slug.startsWith("demo-") || translation.excerpt.includes("[[demo]]") || translation.title === "ข่าวตัวอย่างสำหรับทดสอบระบบ");
}

export function postsForEnvironment(posts: PostDto[], environment: SiteEnvironment) {
  if (environment === "production" && posts.some(isDemoPost)) {
    return posts.filter((post) => !isDemoPost(post));
  }
  return posts;
}

export function thaiTranslation(post: PostDto) {
  return post.translations.find((translation) => translation.locale === "th") ?? post.translations[0];
}
