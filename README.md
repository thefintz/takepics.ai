# NuxtAuth

Minimal example showing how to use [`@sidebase/nuxt-auth`][1] to handle Auth0
logins.

## About

This is a very minimal example. For more info, please check the official
sidebase [docs][2].

## Setup

Locally, you just need to setup node like usual:

```bash
npm install
```

That is it, you can run your development application using:

```bash
npm run dev
```

## Auth0 setup

In order to get things properly working, you will need to create an Auth0 SPA
application. Finally, after you created it, you will need to populate the `.env`
file with the following values:

```bash
# generate a secret using: `openssl rand -hex 32`
NUXT_SECRET=my-random-secret

# In your Auth0 dashboard: Application > Basic Information > Domain
AUTH0_ISSUER=https://YOUR-DOMAIN.us.auth0.com

# In your Auth0 dashboard: Application > Basic Information > Client ID
AUTH0_CLIENT_ID=YOUR-CLIENT-ID

# In your Auth0 dashboard: Application > Basic Information > Client Secret
AUTH0_CLIENT_SECRET=YOUR-CLIENT-SECRET
```

You will need o configure the callback URL in Application > Application URIs >
Allowed Callback URLs

```
http://localhost:3000/api/auth/callback/auth0
```

[1]: https://github.com/sidebase/nuxt-auth
[2]: https://sidebase.io/nuxt-auth/