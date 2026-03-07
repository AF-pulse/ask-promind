import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],

  base: "/",   // viktigt för GitHub Pages + custom domain

  server: {
    proxy: {
      "/api": {
        target: "https://promind.fly.dev",
        changeOrigin: true,
        secure: true
      }
    }
  }
})
