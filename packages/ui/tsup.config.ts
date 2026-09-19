import { defineConfig } from "tsup";
import { cpSync, statSync } from "node:fs";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/**/*.{ts,tsx}",
    "src/utils/**/*.ts",
    "!src/**/*.stories.tsx",
    "!src/**/*.test.{ts,tsx}",
  ],
  format: ["esm", "cjs"],
  // Unbundled: each file compiles to its own output file, one-to-one with
  // src/, so relative CSS Module imports keep resolving to the raw .css
  // files copied alongside them below (see onSuccess). Bundling into a
  // single file would flatten directories and break those relative paths,
  // and inlining the CSS through esbuild would strip CSS Modules scoping.
  bundle: false,
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", /\.css$/],
  banner: {
    js: '"use client";',
  },
  onSuccess: async () => {
    cpSync("src/styles", "dist/styles", { recursive: true });
    cpSync("src/components", "dist/components", {
      recursive: true,
      filter: (src) => statSync(src).isDirectory() || src.endsWith(".css"),
    });
  },
});
