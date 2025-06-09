import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // already needed for --host option
    allowedHosts: ["becomes-proceeds-danish-earning.trycloudflare.com"],
  },
});
