import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: [
    "react",
    "react-dom",
    // Optional editors (not bundled)
    "lexical",
    "@lexical/code",
    "@lexical/history",
    "@lexical/link",
    "@lexical/list",
    "@lexical/react",
    "@lexical/rich-text",
    "@lexical/selection",
    "@lexical/table",
    "@lexical/utils",
    "@lexical/html",
    "slate",
    "slate-react",
    "slate-history",
  ],
  loader: {
    ".css": "css",
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
