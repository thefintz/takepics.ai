import { NuxtAuthHandler } from "#auth";
import type { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { UserInsert } from "~/server/utils/db/schema";
import { createUsersService } from "~/server/utils/services/users";

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
		/**
		 * Fetches the user from the database and adds it to the session object
		 *
		 * Use this function to add more properties to the session object, the
		 * object. The one returned by `const { data } = useAuth()`. See example
		 * below
		 */
		async session({ session, token }) {
			if (!token.sub) {
				console.warn("Missing subject in JWT");
				return session;
			}

			const service = createUsersService(db);
			const user = await service.fetch(token.sub);

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

			const newUser: UserInsert = {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
			};

			await db.transaction(async (tx) => {
				const service = createUsersService(tx);

				if (await service.exists(user.id)) {
					console.info(`User ${user.id} exists. Updating...`);
					return await service.update(newUser);
				}

				console.info(`User ${user.id} does not exist. Creating with onboarding model...`);
				return await service.createUserWithOnboardingModel({ ...newUser, imageCredits: 50, trainingCredits: 2 });
			});

			return true;
		},

		async jwt({ token }) {
			return token;
		},
	},
};

export default NuxtAuthHandler(options);
