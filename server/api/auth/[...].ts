import { NuxtAuthHandler } from "#auth";
import type { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const options: AuthOptions = {
  secret: process.env.NUXT_SECRET,
  providers: [
    Auth0Provider.default({
      issuer: process.env.AUTH0_ISSUER,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    }),
  ],
};

export default NuxtAuthHandler(options);
