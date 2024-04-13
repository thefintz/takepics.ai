export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: ["@sidebase/nuxt-auth", "nuxt-primevue", "@nuxt/image"],

  auth: {
    globalappmiddleware: true,
    provider: {
      type: "authjs",
    },
  },
});
