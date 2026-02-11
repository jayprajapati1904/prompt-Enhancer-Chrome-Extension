import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    outDir: resolve(__dirname, "../dist"),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, "src/main.jsx"),
      output: {
        // Single IIFE bundle for content script
        format: "iife",
        entryFileNames: "content.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "content.css";
          }
          return "assets/[name]-[hash][extname]";
        },
        // No code splitting for content scripts
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
});
