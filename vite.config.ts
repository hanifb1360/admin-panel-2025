import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create explicit chunks for better loading performance
          if (id.includes('node_modules')) {
            // Vendor chunks
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('recharts') || id.includes('victory') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }
            if (id.includes('lucide-react') || id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
            return 'vendor-misc';
          }
          
          // Feature-based chunks for application code
          if (id.includes('/charts/advanced/')) {
            return 'charts-advanced';
          }
          if (id.includes('/charts/')) {
            return 'charts-basic';
          }
          if (id.includes('/forms/')) {
            return 'forms';
          }
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
        },
        // Optimize chunk loading
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'main' ? '[name].[hash].js' : '[name]-[hash].js';
        },
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Additional build optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env'],
    // Force optimizations for better development performance
    force: true
  },
  // Enable code splitting in development
  esbuild: {
    target: 'es2020',
    // Drop console statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  // Dev server configuration
  server: {
    // Enable hot module replacement
    hmr: {
      overlay: false
    },
    // Open browser on start
    open: false,
    // Enable file system caching
    fs: {
      strict: false
    }
  }
})
