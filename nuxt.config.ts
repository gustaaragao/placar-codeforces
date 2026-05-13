import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'src',
  serverDir: './server',
  css: ['~/assets/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-11-01',
})
