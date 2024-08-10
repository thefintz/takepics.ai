import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },

  devtools: {
    enabled: true,
  },

  modules: [
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@sidebase/nuxt-auth",
    "nuxt-posthog",
  ],

  // https://tailwind.primevue.org/nuxt/
  // https://github.com/primefaces/primevue-examples/blob/main/nuxt-styled-tailwind/nuxt.config.ts
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
      ripple: true,
    },
    autoImport: true,
  },

  css: [
    // "primevue/resources/themes/lara-dark-green/theme.css",
    "primeicons/primeicons.css",
  ],

  auth: {
    // This makes all pages private by default. If you want to make a page
    // public, you can use `definePageMeta({ auth: false })` on the page `setup`
    //
    // https://auth.sidebase.io/guide/application-side/configuration#globalappmiddleware
    globalAppMiddleware: true,

    // https://auth.sidebase.io/guide/authjs/quick-start#configuration
    provider: {
      type: "authjs",
    },
  },

  runtimeConfig: {
    public: {
      // https://nuxt-posthog.cmitjans.dev/configuration
      posthog: {
        host: process.env.POSTHOG_HOST,
        publicKey: process.env.POSTHOG_PUBLIC_KEY,
      },
    },
  },

  compatibilityDate: "2024-08-09",
});
