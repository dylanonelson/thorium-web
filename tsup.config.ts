import svgrPlugin from "esbuild-plugin-svgr";

import { defineConfig } from "tsup";

export default defineConfig({
  name: "Thorium Web",
  tsconfig: "./tsconfig.bundle.json",
  format: ["esm"],
  entry: [
    "src/core/Components/index.ts",
    "src/core/Helpers/index.ts",
    "src/core/Hooks/index.ts", 
    "src/components/Epub/index.ts",
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
  noExternal: [
    "classNames", 
    "debounce"
  ],
  external: [
    "react", 
    "react-dom", 
    "react-redux", 
    "@reduxjs/toolkit", 
    "react-aria", 
    "react-aria-components", 
    "react-stately", 
    "react-resizable-panels", 
    "react-modal-sheet",
    "motion",
    "@readium/css",
    "@readium/navigator",
    "@readium/navigator-html-injectables",
    "@readium/shared"
  ]
});