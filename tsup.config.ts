import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web",
  entry: [
    "src/core/Components/index.ts",
    "src/core/Helpers/index.ts",
    "src/core/Hooks/index.ts", 
    "src/components/index.ts",
    "src/lib/index.ts",
    "src/preferences/index.ts"
  ],
  loader: {
    ".css": "copy"
  },
  esbuildPlugins: [svgrPlugin()],
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  splitting: true,
  bundle: true,
  noExternal: ["classNames", "debounce", "json-templates"],
  // noExternal: [/(.*)/] // That's to bundle everything, including dependencies,
  tsconfig: "./tsconfig.bundle.json"
});