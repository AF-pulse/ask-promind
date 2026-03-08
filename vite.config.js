import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({

  plugins: [react()],

  define: {
    __API_BASE__: JSON.stringify(
      mode === "production"
        ? "https://promind.fly.dev/api"
        : "/api"
    )
  },

  build: {
    sourcemap: true
  }

}))
