import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const clerkEnabled = !!env.VITE_CLERK_PUBLISHABLE_KEY

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        ...(clerkEnabled ? {} : {
          '@clerk/clerk-react': path.resolve(__dirname, 'src/mocks/clerk-mock.jsx'),
          '@clerk/react-router': path.resolve(__dirname, 'src/mocks/clerk-mock.jsx'),
        }),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: clerkEnabled
            ? { vendor: ['react', 'react-dom', 'react-router-dom', '@clerk/clerk-react'] }
            : { vendor: ['react', 'react-dom', 'react-router-dom'] },
        },
      },
    },
  }
})
