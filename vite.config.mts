import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const srcPath = fileURLToPath(new URL('src', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': srcPath,
      '@assets': fileURLToPath(new URL('src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('src/components', import.meta.url)),
      '@layouts': fileURLToPath(new URL('src/layouts', import.meta.url)),
      '@views': fileURLToPath(new URL('src/views', import.meta.url)),
      '@router': fileURLToPath(new URL('src/router', import.meta.url)),
      '@stores': fileURLToPath(new URL('src/stores', import.meta.url)),
      '@services': fileURLToPath(new URL('src/services', import.meta.url)),
      '@types': fileURLToPath(new URL('src/types', import.meta.url)),
      '@interfaces': fileURLToPath(new URL('src/interfaces', import.meta.url)),
      '@plugins': fileURLToPath(new URL('src/plugins', import.meta.url)),
      '@composables': fileURLToPath(new URL('src/composables', import.meta.url)),
      '@constants': fileURLToPath(new URL('src/constants', import.meta.url)),
      '@utils': fileURLToPath(new URL('src/utils', import.meta.url)),
      '@styles': fileURLToPath(new URL('src/styles', import.meta.url)),
      '@workflow': fileURLToPath(new URL('src/workflow', import.meta.url)),
      '@dashboard': fileURLToPath(new URL('src/dashboard', import.meta.url)),
      '@imports': fileURLToPath(new URL('src/imports', import.meta.url)),
      '@reports': fileURLToPath(new URL('src/reports', import.meta.url)),
      '@validation': fileURLToPath(new URL('src/validation', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    // Em desenvolvimento o Directus é acessado via proxy same-origin,
    // dispensando liberação de localhost no CORS_ORIGIN do servidor.
    proxy: {
      '/directus': {
        target: process.env.DIRECTUS_PROXY_TARGET ?? 'https://mailminer.soultech.solutions',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/directus/, ''),
      },
      '/mercante': {
        target: process.env.MERCANTE_PROXY_TARGET ?? 'https://nirron-mercante.soultech.solutions',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/mercante/, ''),
      },
    },
  },
})
