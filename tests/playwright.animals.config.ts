import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testMatch: "unified-animals.spec.ts",
  workers: 1,
  projects: [{ name: "disposable-animal-voting", use: { baseURL: "http://127.0.0.1:4341" } }],
});
