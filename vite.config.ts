import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      adapter,
      entry: 'server/index.ts',
      exclude: [
        /^(?!\/api).*/
      ],
      injectClientScript: false,
    })
  ]
})
