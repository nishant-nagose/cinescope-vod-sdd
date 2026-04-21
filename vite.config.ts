import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    base: '/cinescope-vod-sdd/',
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  })
}