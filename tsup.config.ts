import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web",
  entry: {
    components: "src/packages/Components/index.ts",
    helpers: "src/packages/Helpers/index.ts",
    hooks: "src/packages/Hooks/index.ts",
    lib: "src/lib/index.ts",
    preferences: "src/preferences/index.ts",
    statefulComponents: "src/components/index.ts"
  },
  loader: {
    ".css": "copy"
  },
  esbuildPlugins: [svgrPlugin()],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: false,
  bundle: true,
  noExternal: ["classNames", "debounce", "json-templates"],
  // noExternal: [/(.*)/] // That’s to bundle everything, including dependencies,
  tsconfig: "./tsconfig.bundle.json"
});