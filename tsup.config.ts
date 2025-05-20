import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web",
  entry: [
    "src/packages/Components/index.ts",
    "src/packages/Components/**/*.{ts,tsx}",
    "src/packages/Helpers/index.ts",
    "src/packages/Helpers/**/*.{ts,tsx}",
    "src/packages/Hooks/index.ts", 
    "src/packages/Hooks/**/*.{ts,tsx}",
    "src/lib/index.ts",
    "src/lib/**/*.{ts,tsx}",
    "src/preferences/index.ts",
    "src/preferences/**/*.{ts,tsx}",
    "src/components/index.ts",
    "src/components/**/*.{ts,tsx}"
  ],
  loader: {
    ".css": "copy"
  },
  esbuildPlugins: [svgrPlugin()],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  treeshake: false,
  bundle: true,
  noExternal: ["classNames", "debounce", "json-templates"],
  // noExternal: [/(.*)/] // That’s to bundle everything, including dependencies,
  tsconfig: "./tsconfig.bundle.json"
});