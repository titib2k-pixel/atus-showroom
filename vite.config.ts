import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🛡️ ESTA É A CHAVE! Libera o acesso pela rede local (Wi-Fi)
    port: 5173
  }
})