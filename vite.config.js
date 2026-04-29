import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    // ✅ Raise chunk warning limit
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        manualChunks: {
          // ✅ All Lucide icons in ONE file (was 15 separate files!)
          'vendor-icons':   ['lucide-react'],

          // ✅ React core together
          'vendor-react':   ['react', 'react-dom'],

          // ✅ Router separate
          'vendor-router':  ['react-router-dom'],

          // ✅ Helmet separate
          'vendor-helmet':  ['react-helmet-async'],

          // ✅ PDF tools (heavy — only loads on PDF pages)
          'vendor-pdf':     ['pdf-lib', 'pdfjs-dist'],

          // ✅ Image tools (only loads on image pages)
          'vendor-image':   ['browser-image-compression'],

          // ✅ QR code (only loads on QR page)
          'vendor-qr':      ['qrcode.react'],

          // ✅ Tesseract OCR (very heavy — only on OCR page)
          'vendor-ocr':     ['tesseract.js'],

          // ✅ DOCX tools (only on PDF to Word page)
          'vendor-docx':    ['docx', 'file-saver'],

          // ✅ Crop tool (only on image cropper page)
          'vendor-crop':    ['react-image-crop'],
        },
      },
    },

    // ✅ Enable minification
    minify: 'esbuild',

    // ✅ Remove console.log in production
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
  },

  // ✅ Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'lucide-react',
    ],
  },
})