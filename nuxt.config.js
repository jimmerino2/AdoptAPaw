// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  components: {
    dirs: [
      { path: '~/components', extensions: ['vue'], pathPrefix: false },
      { path: '~/components/layout', extensions: ['vue'], pathPrefix: false },
      { path: '~/components/ui', extensions: ['vue'], pathPrefix: true },
      { path: '~/composables', extensions: ['vue'], pathPrefix: true }
    ]
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt']
});
