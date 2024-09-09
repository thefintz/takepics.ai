import type { H3Event } from "h3";
import Stripe from "stripe";

export const useServerStripe = (event?: H3Event): Stripe => {
	const config = useRuntimeConfig(event);
	console.info(config.stripe);
	return new Stripe(config.stripe.apiToken);
};
