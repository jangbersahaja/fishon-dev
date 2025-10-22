import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.{test,spec}.ts"],
    globals: true,
    coverage: {
      enabled: false,
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  esbuild: {
    loader: "tsx",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
