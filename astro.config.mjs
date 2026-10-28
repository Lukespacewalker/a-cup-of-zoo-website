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
  env: {
    schema: {
      SITE_ENV: envField.string({ context: "server", access: "secret", default: "local" }),
      CONTENT_MODE: envField.string({ context: "server", access: "secret", default: "fixture" }),
      CMS_BASE_URL: envField.string({ context: "server", access: "secret", optional: true }),
      SEARCH_INDEXING: envField.string({ context: "server", access: "secret", default: "disabled" }),
    },
  },
});
