import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy':
        "frame-ancestors https://carrierintelligence.com https://www.carrierintelligence.com https://*.gohighlevel.com https://*.myhighlevel.com",
    },
  },
})
