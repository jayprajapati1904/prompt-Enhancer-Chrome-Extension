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
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL ||
        "https://api.bytez.com/models/v2/openai/gpt-4.1",
    ),
    "import.meta.env.VITE_API_KEY": JSON.stringify(
      process.env.VITE_API_KEY || "3a68d6d2a8c851e3a17b9caf8fe9b41a",
    ),
  },
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
