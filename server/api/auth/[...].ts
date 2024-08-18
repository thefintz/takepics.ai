import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";

const config = useRuntimeConfig();

const options = {
  secret: config.secret,
  origin: `https://${config.envVercelUrl}`,
  // We can add more providers here, such as GitHub, Google and so on...
  // 
  // List of available providers:
  // https://github.com/nextauthjs/next-auth/tree/v4/packages/next-auth/src/providers
  providers: [
    // For some reason, the type definition is not working for this block...
    // @ts-expect-error
    Auth0Provider.default({
      issuer: config.auth0.issuer,
      clientId: config.auth0.clientId,
      clientSecret: config.auth0.clientSecret,
    }),
  ],
};

console.log(options);

export default NuxtAuthHandler(options);
