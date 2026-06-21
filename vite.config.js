import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // إجبار التطبيق على بورت 8080
    strictPort: true, // يمنع الانتقال لبورت آخر إذا كان 8080 مشغولاً
  }
})