import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// To open the dev server through a tunnel (ngrok, etc.), set DEV_ALLOWED_HOST
// in your shell or .env.local, e.g. DEV_ALLOWED_HOST=my-tunnel.ngrok-free.dev
const devAllowedHost = process.env.DEV_ALLOWED_HOST

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    allowedHosts: devAllowedHost ? [devAllowedHost] : undefined,
  },
})
