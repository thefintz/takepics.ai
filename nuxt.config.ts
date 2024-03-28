export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  modules: ["@sidebase/nuxt-auth", "nuxt-primevue", "@nuxt/image"],
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
    },
  },
  nitro: {
    preset: "vercel-edge",
  },
});
