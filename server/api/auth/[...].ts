import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { AuthOptions } from "next-auth";
import type { User } from "@/server/utils/db";

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
		/**
		 * Fetches the user from the database and adds it to the session object
		 */
		async session({ session, token }) {
			// For example, add user properties to the session object
			// session.user = fetchUserFromDatabase()  // not implemented
			// Now the user object will be available in the session object

			if (!token.sub) {
				return session;
			}

			const user = await fetchUser(token.sub);

			return { ...session, user };
		},

		/**
		 * Inserts the new user into the database if they don't already exist or
		 * updates their information if they do
		 */
		async signIn({ user }) {
			if (!user.id || !user.name || !user.email || !user.image) {
				return false;
			}

			const newUser: User = {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
			};

			await upsertUser(newUser);

			return true;
		},

		async jwt({ token }) {
			return token;
		},
	},
};

export default NuxtAuthHandler(options);
