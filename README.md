# NuxtAuth

A small template to use Nuxt with some features already baked in

## About

This is a small project to be used as a template of sorts. It comes with the
following features:

- PrimeVue, for UI components
- Tailwind, for styling
- Auth0, for authentication
- PostHog, for analytics

## Setup

Locally, you just need to setup node like usual:

```bash
npm install
```

That is it, you can run your development application using:

```bash
npm run dev
```

## Configuration

Ok. Here is the annoying part: configuring everything... It takes some time.
This section will go over how to configure each of the services used in this
project.

### Environment variables

Check the `.env.example` file for the environment variables you need to set with
some basic information.

### Auth0

For Auth0 to work we first need to create an Auth0 application. Create/Login
into your account. Check the left hand side menu and navigate to:

```
Applications > Applications > Create Application
```

Select the "Single Page Web Applications" preset and click "Create". Go to the
"Settings" tab. Here you should see the "Basic Information" section with the
credentials we need for our application to work. Most importantly:

- Client ID
- Client Secret
- Domain (issuer)

Add those values to your `.env` file like so:

```conf
# In your Auth0 dashboard: Application > Basic Information > Client ID
NUXT_AUTH0_CLIENT_ID=
# In your Auth0 dashboard: Application > Basic Information > Client Secret
NUXT_AUTH0_CLIENT_SECRET=
# In your Auth0 dashboard: Application > Basic Information > Domain
NUXT_AUTH0_ISSUER=https://**********.us.auth0.com
```

We are not done yet... You will need to further configure the application to
work with our application. You should add the following URLs to the list of
"Allowed Callback URLs" (:warning: they must be separated by commas :warning:):

```
http://localhost:3000/auth/auth0,
http://localhost:3000/api/auth/callback/auth0,
https://PATH-TO-YOUR-HOSTED-APP/api/auth/callback/auth0
```

The `localhost` values are for our application to work in local development. The
hosted value is the URL of your deployed application.

### PostHog

PostHog, at least, is easier to configure. Thanks to the posthog nuxt module.
We simply need to set the following environment variables:

```conf
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PUBLIC_KEY=phc_**********
```

Once you set those, it is done! If you don't know where to find the public key,
you can generate one in your PostHog project settings:

- Go to your project in PostHog
- "Settings" (bottom left)

Scroll down a little bit, or search for "API Key". Just copy that value and set
to the `POSTHOG_PUBLIC_KEY` environment variable in your `.env` file.

#### Posthog component

The `Posthog` component is a renderless component that calls the `$identify`
function. This function is used for us to identify an user in a session from
PostHog. For example, in our application, we identify the user by adding email
information if they are logged in. This way we can group sessions and search for
info by user in PostHog.
