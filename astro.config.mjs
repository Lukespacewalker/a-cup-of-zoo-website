import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://acupofzoo.com",
  output: "server",
  adapter: cloudflare(),
  session: false,
  trailingSlash: "always",
  devToolbar: { enabled: false },
  server: { host: "127.0.0.1", port: 4321 },
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev",
        pathname: "/media/*",
      },
    ],
  },
  vite: {
    build: {
      // Inline small style chunks while keeping shared site CSS cacheable.
      assetsInlineLimit: (file, content) =>
        file.endsWith(".css") ? content.length < 16 * 1024 : undefined,
    },
  },
  env: {
    schema: {
      SITE_ENV: envField.string({ context: "server", access: "secret", default: "local" }),
      CONTENT_MODE: envField.string({ context: "server", access: "secret", default: "fixture" }),
      CMS_BASE_URL: envField.string({ context: "server", access: "secret", optional: true }),
      SEARCH_INDEXING: envField.string({ context: "server", access: "secret", default: "disabled" }),
    },
  },
});
