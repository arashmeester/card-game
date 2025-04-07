// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'reka-ui/nuxt'],
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    exposeConfig: true
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ]
})
