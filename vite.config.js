import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
              react(),
              babel({ presets: [reactCompilerPreset()] })
            ],
  resolve: {
              alias: {
                        '@theme':         '/src/_theme',
                        '@assets':        '/src/_assets',
                        '@components':    '/src/components',
                        '@hooks':          '/src/_hooks',
                        '@crud':          '/src/_crud',
                        '@':              '/src'
                      }
            }
})
