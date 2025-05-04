import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web Components",
  entry: {
    components: "src/packages/Components/index.ts",
    hooks: "src/packages/Hooks/index.ts",
    redux: "src/lib/index.ts",
    preferences: "src/preferences/index.ts"
  },
  esbuildPlugins: [svgrPlugin()],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: false,
  bundle: true,
  noExternal: ["debounce", "react-resizable-panels", "react-modal-sheet"]
  // noExternal: [/(.*)/] That’s to bundle everything, including dependencies
});