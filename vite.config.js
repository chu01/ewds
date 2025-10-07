import { defineConfig } from "vite";
import path from "path";

// ✅ Define absolute paths for imports
const resolvePath = (dir) => path.resolve(__dirname, dir);

export default defineConfig({
  root: "src", // Your component source directory
  base: "./",
  publicDir: resolvePath("public"),
  build: {
    outDir: resolvePath("dist"),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolvePath("src/index.js"),
      },
      output: {
        entryFileNames: "js/[name].min.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "css/[name].min.[ext]";
          }
          if (assetInfo.name && assetInfo.name.match(/\.(png|jpe?g|gif|svg)$/)) {
            return "img/[name].[ext]";
          }
          return "[name].[ext]";
        },
      },
    },
  },

  // 🧠 Aliases for cleaner imports
  resolve: {
    alias: {
      "@": resolvePath("src"),
      "@components": resolvePath("src/packages/components"),
      "@core": resolvePath("src/packages/core"),
      "@styles": resolvePath("src/styles"),
      "@img": resolvePath("src/packages/img"),
    },
  },

  // 🧩 Loaders for SCSS and PostCSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@core/_variables.scss" as *; @use "@core/_mixins.scss" as *;`,
      },
    },
    postcss: {
      plugins: [require("autoprefixer"), require("postcss-csso")],
    },
  },

  // 🌐 Local dev server
  server: {
    open: true,
    port: 5173,
    cors: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },

  // ⚙️ Preview mode for built files
  preview: {
    port: 4173,
    open: true,
  },
});
