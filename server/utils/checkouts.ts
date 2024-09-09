import type { Stripe } from "stripe";
import { db, type CheckoutInsert, Checkouts, type Checkout } from "./db";

export const createCheckout = async (
	user: User,
	opts: Omit<Stripe.Checkout.SessionCreateParams, "metadata">,
): Promise<Checkout> => {
	const stripe = useServerStripe();

	console.info("Creating Stripe checkout session");
	const stripeCheckout = await stripe.checkout.sessions.create({
		...opts,
		metadata: {
			user_id: user.id,
			user_email: user.email,
			user_name: user.name,
			user_image: user.image,
		},
	});
	console.info("Created Stripe checkout session", stripeCheckout.id);
	console.debug(stripeCheckout);

	const checkout: CheckoutInsert = {
		id: stripeCheckout.id,
		userId: user.id,
		session: stripeCheckout,
		event: null,
	};

	console.info(`Inserting checkout ${checkout.id} into database`);
	const [dbCheckout] = await db.insert(Checkouts).values(checkout).returning();
	console.info(`Inserted checkout ${dbCheckout.id} into database`);
	console.debug(dbCheckout);

	return dbCheckout;
};
