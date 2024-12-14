// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  components: {
    dirs: [
      { path: "~/components", extensions: ["vue"], pathPrefix: false },
      { path: "~/components/ui", extensions: ["vue"], pathPrefix: true },
      { path: "~/composables", extensions: ["vue"], pathPrefix: true },
    ],
  },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/supabase"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  supabase: {
    redirect: false, // Disable redirects for auth by default
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo_v1.png" }],
    },
  },
});
