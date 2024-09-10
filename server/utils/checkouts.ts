import type { Stripe } from "stripe";
import { db, type CheckoutInsert, Checkouts, type Checkout } from "./db";

export const createCheckout = async (
	user: User,
	priceId: string,
	successUrl: string,
): Promise<Checkout> => {
	const stripe = useServerStripe();

	const stripePricePromise = stripe.prices.retrieve(priceId);

	const stripeCheckoutPromise = stripe.checkout.sessions.create({
		mode: "payment",
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: successUrl,
		metadata: {
			user_id: user.id,
			user_email: user.email,
			user_name: user.name,
			user_image: user.image,
		},
	});

	const [stripePrice, stripeCheckout] = await Promise.all([
		stripePricePromise,
		stripeCheckoutPromise,
	]);

	console.info("Retrieved Stripe price", stripePrice.id);
	console.debug(stripePrice);
	console.info("Created Stripe checkout session", stripeCheckout.id);
	console.debug(stripeCheckout);

	const checkout: CheckoutInsert = {
		id: stripeCheckout.id,
		userId: user.id,
		session: stripeCheckout,
		price: stripePrice,
		event: null,
	};

	console.info(`Inserting checkout ${checkout.id} into database`);
	const [dbCheckout] = await db.insert(Checkouts).values(checkout).returning();
	console.info(`Inserted checkout ${dbCheckout.id} into database`);
	console.debug(dbCheckout);

	return dbCheckout;
};

export const fetchQuantity = async (user: User): Promise<number> => {
	const stripe = useServerStripe();
	const customer = await stripe.prices.retrieve;
	return customer.credits_data[0].remaining;
};
