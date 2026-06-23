import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, requests to /backend/api/* are proxied to your local
// PHP server (e.g. `php -S localhost:8000 -t server/public` from the server/
// folder) so the frontend and backend work together in development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/backend": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ""),
      },
    },
  },
});
