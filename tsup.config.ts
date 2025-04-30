import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web Components",
  entry: {
    components: "src/packages/Components/index.ts",
    redux: "src/lib/index.ts",
    preferences: "src/preferences/index.ts"
  },
  esbuildPlugins: [svgrPlugin()],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  bundle: true,
  noExternal: ["debounce"]
  // noExternal: [/(.*)/] That’s to bundle everything, including dependencies
});