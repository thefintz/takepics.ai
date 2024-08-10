import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";

const options = {
  origin: process.env.AUTH_ORIGIN,
  secret: process.env.NUXT_SECRET,
  providers: [
    // @ts-expect-error: for some reason, the type definition is not working
    Auth0Provider.default({
      issuer: process.env.AUTH0_ISSUER,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    }),
  ],
};

export default NuxtAuthHandler(options);
