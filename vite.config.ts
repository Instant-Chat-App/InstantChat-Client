import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   server: {
      port: 3000
   },
   css: {
      devSourcemap: true
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src')
      }
   }
})
