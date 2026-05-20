import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://vanivoicechat.kotiboxglobaltech.online',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})