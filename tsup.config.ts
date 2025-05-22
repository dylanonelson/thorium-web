import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web",
  entry: [
    "src/packages/Components/index.ts",
    "src/packages/Helpers/index.ts",
    "src/packages/Hooks/index.ts", 
    "src/components/index.ts",
  ],
  loader: {
    ".css": "copy"
  },
  esbuildPlugins: [svgrPlugin()],
  splitting: true, // Enable code splitting
  // ... existing code ...
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  bundle: true,
  noExternal: ["classNames", "debounce", "json-templates"],
  // noExternal: [/(.*)/] // That's to bundle everything, including dependencies,
  tsconfig: "./tsconfig.bundle.json"
});