import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { AuthOptions } from "next-auth";

const config = useRuntimeConfig();

const options: AuthOptions = {
	// Used to encrypt and hash auth data
	// Generate using: `openssl rand -hex 32`
	secret: config.secret,

	// We can add more providers here, such as GitHub, Google and so on...
	//
	// List of available providers:
	// https://next-auth.js.org/providers/
	providers: [
		// Expected typescript error:
		// https://auth.sidebase.io/guide/authjs/quick-start#adding-a-provider
		//
		// @ts-expect-error
		Auth0Provider.default({
			issuer: config.auth0.issuer,
			clientId: config.auth0.clientId,
			clientSecret: config.auth0.clientSecret,
		}),
	],

	callbacks: {
		// Use this function to add more properties to the session object, the
		// object. The one returned by `const { data } = useAuth()`. See example
		// below
		async session({ session, token }) {
			// For example, add user properties to the session object
			// session.user = fetchUserFromDatabase()  // not implemented
			// Now the user object will be available in the session object
			return session;
		},
	},
};

export default NuxtAuthHandler(options);
