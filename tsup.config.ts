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
    // Lexical packages (use dynamic imports for optional support)
    "lexical",
    "@lexical/react",
    "@lexical/rich-text",
    "@lexical/code",
    "@lexical/link",
    "@lexical/list",
    "@lexical/table",
    "@lexical/history",
    "@lexical/selection",
    "@lexical/utils",
    "@lexical/html",
    // Slate packages (optional)
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
