import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://acupofzoo.invalid",
  output: "server",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "always",
  server: { host: "127.0.0.1", port: 4321 },
  env: {
    schema: {
      SITE_ENV: envField.string({ context: "server", access: "secret", default: "local" }),
      CONTENT_MODE: envField.string({ context: "server", access: "secret", default: "fixture" }),
      CMS_BASE_URL: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});
