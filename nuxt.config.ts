import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
	compatibilityDate: "2024-08-09",

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
		"@vueuse/nuxt",
		"@nuxt/scripts",
	],

	scripts: {
		registry: {
		  stripe: true,
		}
	},


	// https://tailwind.primevue.org/nuxt/
	// https://github.com/primefaces/primevue-examples/blob/main/nuxt-styled-tailwind/nuxt.config.ts
	primevue: {
		options: {
			theme: {
				preset: Aura,
			},
		},
	},

	// Files added here are included in all pages. We want to add the PrimeIcons
	// CSS
	//
	// https://nuxt.com/docs/api/nuxt-config#css
	// https://github.com/primefaces/primeicons
	// https://primevue.org/icons/
	css: ["primeicons/primeicons.css"],

	auth: {
		// This makes all pages private by default. If you want to make a page
		// public, you can use `definePageMeta({ auth: false })` on the page `setup`
		//
		// https://auth.sidebase.io/guide/application-side/configuration#globalappmiddleware
		globalAppMiddleware: true,

		// We can change this depending on the provider we deploy to. Most have
		// an environment variable that contains the URL
		// originEnvKey: "AUTH_ORIGIN",

		// https://auth.sidebase.io/guide/authjs/quick-start#configuration
		provider: {
			type: "authjs",
			trustHost: false,
			defaultProvider: "auth0",
			addDefaultCallbackUrl: "/",
		},
	},

	// Configurations from here should be overriden by using `.env` or environment
	// variables. Check `.env.example` for documentation on each of those values
	//
	// https://nuxt.com/docs/guide/going-further/runtime-config
	runtimeConfig: {
		secret: "",

		postgresUrl: "",

		supabase: {
			url: "",
			key: "",
			bucket: ""
		},

		auth0: {
			issuer: "",
			clientId: "",
			clientSecret: "",
		},

		replicate: {
			username: "",
			apiToken: "",
			model: "",
			version: "",
			webhookSecret: "",
			webhookUrl: "",
			webhookUrlTrainings: "",
		},

		stripe: {
			priceId: "",
			imageCreditsPerCheckout: 100,
			trainingCreditsPerCheckout: 1,
			secretKey: "",
			webhookSecret: "",
			successUrl: "",
		},

		// Configurations inside the `public` object are available to the client.
		// Eg. in the browser
		public: {
			posthog: {
				// Uncomment this to disable PostHog
				disabled: true,
			},
		},
	},

	nitro: {
		experimental: {
			openAPI: true,
		},
	},
});
