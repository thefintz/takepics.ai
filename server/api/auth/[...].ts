import { NuxtAuthHandler } from "#auth";
import type { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const options: AuthOptions = {
  secret: process.env.NUXT_SECRET ,
  providers: [
    Auth0Provider.default({
      origin: process.env.ORIGIN,
      issuer: process.env.NUXT_AUTH0_ISSUER,
      clientId: process.env.NUXT_AUTH0_CLIENT_ID,
      clientSecret: process.env.NUXT_AUTH0_CLIENT_SECRET,
    }),
  ],
};

export default NuxtAuthHandler(options);
