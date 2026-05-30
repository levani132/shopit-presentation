import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    open: true,
    // Allow Vite to serve files from the parent folder so the presenter
    // notes view can `import speech?raw` from ../ShopIt-Speech-v2.md.
    fs: {
      allow: [".."],
    },
  },
});
