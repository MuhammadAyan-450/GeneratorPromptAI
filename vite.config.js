import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // ✅ Better file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        manualChunks(id) {
          // React core
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react'
          }

          // Router
          if (id.includes('react-router-dom')) {
            return 'vendor-router'
          }

          // Helmet
          if (id.includes('react-helmet-async')) {
            return 'vendor-helmet'
          }

          // Icons (only one chunk)
          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          // PDF tools
          if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) {
            return 'vendor-pdf'
          }

          // Image tools
          if (id.includes('browser-image-compression')) {
            return 'vendor-image'
          }

          // OCR
          if (id.includes('tesseract.js')) {
            return 'vendor-ocr'
          }

          // DOCX tools
          if (id.includes('docx') || id.includes('file-saver')) {
            return 'vendor-docx'
          }

          // QR
          if (id.includes('qrcode.react')) {
            return 'vendor-qr'
          }
        }
      }
    },

    minify: 'esbuild',

    esbuildOptions: {
      drop: ['console', 'debugger']
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'lucide-react'
    ]
  }
})