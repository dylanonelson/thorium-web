import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import svgr from "@svgr/rollup";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json"; // Add this import
import glob from "glob";
import path from "path";

// Define all package entry points based on exports in package.json
const packageEntries = {
  // Components package
  "packages/Components": "src/packages/Components/index.ts",
  // Helpers package
  "packages/Helpers": "src/packages/Helpers/index.ts",
  // Hooks package
  "packages/Hooks": "src/packages/Hooks/index.ts",
  // Lib package
  "lib": "src/lib/index.ts",
  // Preferences package
  "preferences": "src/preferences/index.ts",
  // StatefulComponents package
  "components": "src/components/index.ts"
};

// Get all component entry points for individual components
const componentEntries = glob.sync("src/components/**/index.ts").reduce((acc, file) => {
  const name = path.dirname(file).split("/").pop();
  acc[`components/${name}`] = file;
  return acc;
}, {});

// Get all packages/Components entry points
const packagesComponentEntries = glob.sync("src/packages/Components/**/index.ts").reduce((acc, file) => {
  const name = path.dirname(file).split("/").pop();
  acc[`packages/Components/${name}`] = file;
  return acc;
}, {});

// Get all packages/Helpers entry points
const helpersEntries = glob.sync("src/packages/Helpers/**/index.ts").reduce((acc, file) => {
  const name = path.dirname(file).split("/").pop();
  acc[`packages/Helpers/${name}`] = file;
  return acc;
}, {});

// Get all packages/Hooks entry points
const hooksEntries = glob.sync("src/packages/Hooks/**/index.ts").reduce((acc, file) => {
  const name = path.dirname(file).split("/").pop();
  acc[`packages/Hooks/${name}`] = file;
  return acc;
}, {});

// Get all lib entry points
const libEntries = glob.sync("src/lib/**/!(*.test|*.spec).ts").reduce((acc, file) => {
  const basename = path.basename(file, ".ts");
  if (basename !== "index") {
    acc[`lib/${basename}`] = file;
  }
  return acc;
}, {});

// Get all preferences entry points
const preferencesEntries = glob.sync("src/preferences/**/index.ts").reduce((acc, file) => {
  const name = path.dirname(file).split("/").pop();
  acc[`preferences/${name}`] = file;
  return acc;
}, {});

// Merge all entries
const allEntries = {
  ...packageEntries,
  ...componentEntries,
  ...packagesComponentEntries,
  ...helpersEntries,
  ...hooksEntries,
  ...libEntries,
  ...preferencesEntries
};

// Common plugins
const plugins = [
  // Automatically externalize peerDependencies
  peerDepsExternal(),
  
  // Add JSON plugin
  json(),
  
  // Resolve node modules
  resolve({
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }),
  
  // Convert CommonJS modules to ES6
  commonjs(),
  
  // Process TypeScript files
  typescript({
    tsconfig: "./tsconfig.bundle.json",
    declaration: false,
    outputToFilesystem: true,
    tsBuildInfoFile: "./dist/.tsbuildinfo"
  }),
  
  // Process CSS modules
  postcss({
    modules: function(filepath) {
      // Exclude reader.css from being processed as a module
      return !filepath.includes('reader.css');
    },
    extract: true,
    minimize: true,
    // Generate .d.ts files for CSS modules
    autoModules: true,
    namedExports: true,
  }),
  
  // Process SVG files with SVGR
  svgr({
    svgo: false,
    titleProp: true,
    ref: true,
  }),
  
  // Transpile with Babel
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  }),
  
  // Add "use client" directive
  {
    name: "use-client-directive",
    renderChunk(code, chunk, options) {
      // Only add 'use client' to ESM format outputs
      if (options.format === 'es' && !code.includes('"use client";') && !code.includes("'use client';")) {
        return {
          code: '"use client";\n\n' + code,
          map: null
        };
      }
      return null;
    }
  }
];

// Create config for each entry point
const configs = Object.entries(allEntries).map(([name, input]) => ({
  input,
  output: [
    {
      file: `dist/${name}/index.js`,
      format: "esm",
      sourcemap: true,
      exports: "named"
    },
    {
      file: `dist/${name}/index.cjs.js`,
      format: "cjs",
      sourcemap: true,
      exports: "named"
    },
  ],
  plugins,
  // Add this onwarn handler to suppress the 'use client' warning
  onwarn(warning, warn) {
    // Ignore the 'use client' directive warning
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && 
        warning.message.includes("'use client'")) {
      return;
    }
    // For other warnings, use the default handler
    warn(warning);
  },
  // Mark these as external to ensure they"re not bundled
  external: [
    "react", 
    "react-dom",
    "react/jsx-runtime",
    "@types/react",
    // Important: externalize the preferences context
    /^@\/preferences/,
    // Externalize internal dependencies to avoid circular references
    /^@\/packages/,
    /^@\/lib/,
    /^@\/components/,
    // Externalize Readium dependencies
    /^@readium\//,
  ],
}));

// Add type definitions bundles for main packages
// Remove all index file type definitions
const typeConfigs = [];

// Add individual type definition bundles for submodules
Object.entries(allEntries).forEach(([name, input]) => {
  // Skip main entry points (index files)
  if (Object.keys(packageEntries).includes(name)) return;
  
  // Only include individual component entries
  typeConfigs.push({
    input,
    output: {
      file: `dist/${name}/index.d.ts`,
      format: "es",
    },
    plugins: [dts({
      tsconfig: "./tsconfig.bundle.json",
      compilerOptions: {
        tsBuildInfoFile: "./dist/.dts-buildinfo"
      },
      respectExternal: true,
      // Add noCheck to avoid type checking errors
      noCheck: true
    })]
  });
});

export default [...configs, ...typeConfigs];