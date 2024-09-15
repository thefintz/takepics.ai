# AI Photo

Use AI to generate images based on your photos + custom prompts.

## About

This project makes use of the following technologies:

- [Drizzle](https://drizzle.dev/) for database
- [Auth0](https://auth0.com/) for authentication
- [PrimeVue](https://primevue.org/) for UI components
- [Stripe](https://stripe.com/) for payments
- [Vercel](https://vercel.com/) for deployment
- [Replicate](https://replicate.com/) for AI models
- [PostHog](https://posthog.com/) for analytics

## Setup

Locally, you just need to setup node like usual:

```bash
npm install
```

That is it, you can run your development application using:

```bash
npm run dev
```

For local development, I highly recommend using the `ngrok` CLI to expose your
local server to the internet. This way, you can test your webhooks locally.

```bash
ngrok http 3000
```

I also suggest you to make use of the static domain feature in `ngrok`. This
way, you won't need to update your `.env` file every time you restart `ngrok`.

```bash
ngrok http --domain=nice-river-production.ngrok-free.app 3000
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

```conf
http://localhost:3000/api/auth/callback/auth0,
https://PATH-TO-YOUR-HOSTED-APP/api/auth/callback/auth0
```

The `localhost` values are for our application to work in local development. The
hosted value is the URL of your deployed application.

### PostHog

PostHog, at least, is easier to configure. Thanks to the posthog nuxt module.
We simply need to set the following environment variables:

```conf
POSTHOG_API_KEY=phc_**********
POSTHOG_API_HOST=https://us.i.posthog.com
```

Once you set those, it is done! If you don't know where to find the public key,
you can generate one in your PostHog project settings:

- Go to your project in PostHog
- "Settings" (bottom left)

Scroll down a little bit, or search for "API Key". Just copy that value and set
to the `POSTHOG_API_KEY` environment variable in your `.env` file.

#### Posthog component

The `Posthog` component is a renderless component that calls the `$identify`
function. This function is used for us to identify an user in a session from
PostHog. For example, in our application, we identify the user by adding email
information if they are logged in. This way we can group sessions and search for
info by user in PostHog.

### Stripe

After you create/login to your stripe account, you need to:

1. Create a price (Product Catalogue > Add Product)
2. Create a webhook (Developers > Webhooks > Add Endpoint)
3. Get your credentials (Developers > API Keys)

For (1), a price is like a product. So, create a new price when you want to
create a new product. Or, edit it. 

For (2), you need to setup a webhook to receive the `checkout.session.completed`
event. This event is fired when a user completes the checkout process from
Stripe Checkout. You must configure the webshook secret so you can verify the
event was sent by Stripe and not by some malicious actor. In this application,
we have set up our webhook in:

```
/api/webhooks/stripe
```

For (3), you will need the `Secret key`.

Finally, set the following environment variables:

```conf
NUXT_STRIPE_SECRET_KEY=sk_**********
NUXT_STRIPE_WEBHOOK_SECRET=whsec_**********
NUXT_STRIPE_PRICE_ID=price_**********
```

You also need to the following variables:

```conf
# Redirects the user to this page after a successful payment
NUXT_STRIPE_SUCCESS_URL=https://PATH-TO-YOUR-HOSTED-APP/sucesspage
# Number of credits purchased per checkout
NUXT_STRIPE_CREDITS_PER_CHECKOUT=5
```

#### Developing

Checkout the [Stripe documentation](https://stripe.com/docs/webhooks) for more
information on webhooks and how to use Stripe CLI to test them locally. As an
alternative, you can also use [Ngrok](https://dashboard.ngrok.com/) to make your
`localhost:3000` available to the internet.

### Replicate

Replicate is a service that allows you to run AI models in the cloud. We use it
to run our AI models. To setup Replicate, you need to get the the following
credentials:

1. Webhook signing key (Account Settings > Webhooks > Show signing key)
2. API token (Account Settings > API tokens > Create token)

Differently from Stripe, Replicate's way of configuring is to tell a webhook URL
on a per request basis. In this application, we have configured to be:

```conf
NUXT_REPLICATE_WEBHOOK_URL=https://your.host.com/api/webhooks/replicate
```

So, you need to setup the above environment variable with the actual host of
your application when you deploy to production. Again, to test the webhooks
locally... Try [Ngrok](https://dashboard.ngrok.com/).

Finallt, add your credentials and here is your final configuration:

```conf
NUXT_REPLICATE_API_TOKEN=r8_**********
NUXT_REPLICATE_WEBHOOK_SECRET=whsec_**********
NUXT_REPLICATE_WEBHOOK_URL=https://your.host.com/api/webhooks/replicate
```
