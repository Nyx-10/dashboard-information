import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 12 * 1024 * 1024) {
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function supabaseStorageFallbackPlugin() {
  return {
    name: 'supabase-storage-fallback-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.method === 'POST' &&
          (req.url === '/api/upload-image' || req.url === '/api/create-item')
        ) {
          const sbUrl = process.env.VITE_SUPABASE_URL
          const sbServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
          if (!sbUrl || !sbServiceKey) {
            return next()
          }
          const sbAdmin = createClient(sbUrl, sbServiceKey)
          res.setHeader('Content-Type', 'application/json')

          try {
            const body = await readJsonBody(req)

            if (req.url === '/api/upload-image') {
              const {
                fileName,
                fileBase64,
                contentType,
                bucket = 'item-images',
              } = body || {}
              if (!fileName || !fileBase64) {
                res.statusCode = 400
                res.end(
                  JSON.stringify({
                    message: 'Maklumat fail gambar tidak lengkap.',
                  }),
                )
                return
              }
              const targetBucket =
                bucket === 'item-images' ? 'item-images' : 'item-images'
              const cleanBase64 = String(fileBase64).replace(
                /^data:[^;]+;base64,/,
                '',
              )
              const buffer = Buffer.from(cleanBase64, 'base64')
              if (buffer.length > 5 * 1024 * 1024) {
                res.statusCode = 400
                res.end(
                  JSON.stringify({
                    message: 'Saiz fail melebihi had maksimum 5MB.',
                  }),
                )
                return
              }
              const safePath = String(fileName)
                .replace(/\.\./g, '')
                .replace(/^\/+/, '')
              const { error: uploadError } = await sbAdmin.storage
                .from(targetBucket)
                .upload(safePath, buffer, {
                  contentType: contentType || 'image/png',
                  upsert: true,
                })
              if (uploadError) throw uploadError
              const {
                data: { publicUrl },
              } = sbAdmin.storage.from(targetBucket).getPublicUrl(safePath)
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, publicUrl }))
              return
            }

            if (req.url === '/api/create-item') {
              const {
                title,
                type,
                location,
                date,
                description,
                image,
                status = 'open',
                created_by = null,
              } = body || {}
              if (!title || !type || !date) {
                res.statusCode = 400
                res.end(
                  JSON.stringify({
                    message: 'Maklumat laporan tidak lengkap.',
                  }),
                )
                return
              }
              const { data, error } = await sbAdmin
                .from('items')
                .insert([
                  {
                    title,
                    type,
                    location: location || '-',
                    date,
                    description: description || '',
                    image: image || null,
                    status,
                    created_by: created_by || null,
                  },
                ])
                .select()
              if (error) throw error
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, data }))
              return
            }
          } catch (err) {
            res.statusCode = 500
            res.end(
              JSON.stringify({
                message: err.message || 'Ralat pelayan semasa memproses.',
              }),
            )
            return
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    supabaseStorageFallbackPlugin(),
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
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
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
