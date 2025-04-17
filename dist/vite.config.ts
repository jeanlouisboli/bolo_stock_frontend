import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "json" };
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { ManifestV3Export } from "@crxjs/vite-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fix the manifest type
const typedManifest = {
  ...manifest,
  background: {
    service_worker: "src/background.ts",
    type: "module" as const,
  },
} satisfies ManifestV3Export;

export default defineConfig({
  plugins: [react(), crx({ manifest: typedManifest })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
  publicDir: "public",
  server: {
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
    hmr: {
      clientPort: 5173,
      port: 5173,
    },
    watch: {
      ignored: ["**/dist/**"],
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "index.html",
      },
      output: {
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    assetsDir: "assets",
    sourcemap: true,
    minify: false,
    watch: null,
  },
  optimizeDeps: {
    exclude: ["@crxjs/vite-plugin"],
  },
  clearScreen: false,
});
