import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Dashboard ADTEC Melaka',
        short_name: 'ADTEC Melaka',
        description: 'Sistem Pengurusan Maklumat dan Barang Hilang/Jumpa ADTEC Melaka',
        theme_color: '#0F172A',
        background_color: '#0F172A',
        display: 'standalone',
        icons: [
          {
            src: 'https://adtecmelaka.gov.my/images/2021/04/23/logo_adtec_melaka.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://adtecmelaka.gov.my/images/2021/04/23/logo_adtec_melaka.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
