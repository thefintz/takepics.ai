import { eq, sql } from "drizzle-orm";
import type { H3Event } from "h3";
import Stripe from "stripe";
import type { DB } from "~/server/utils/db/client";
import type { UserSelect } from "~/server/utils/db/schema";
import { Checkouts } from "~/server/utils/db/schema";

export interface CheckoutService<T> {
	create(user: UserSelect): Promise<CheckoutSelect>;
	webhook(event: T): Promise<void>;
}

interface StripeCheckoutServiceConf {
	priceId: string;
	successUrl: string;
	imageCreditsPerCheckout: number;
	trainingCreditsPerCheckout: number; // Added for training credits
}

export class StripeCheckoutService
	implements CheckoutService<Stripe.CheckoutSessionCompletedEvent> {
	private readonly stripe: Stripe;
	private readonly tx: DB;
	private readonly conf: StripeCheckoutServiceConf;

	constructor(stripe: Stripe, tx: DB, conf: StripeCheckoutServiceConf) {
		this.stripe = stripe;
		this.tx = tx;
		this.conf = conf;
	}

	/**
	 * Creates a new checkout session for the given user
	 *
	 * It includes the user's information in the metadata
	 */
	async create(user: UserSelect): Promise<CheckoutSelect> {
		console.info("Fetching price", this.conf.priceId);
		const pricePromise = this.stripe.prices.retrieve(this.conf.priceId);

		console.info("Fetching new checkout for user", user.id);
		const sessionPromise = this.stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: this.conf.priceId, quantity: 1 }],
			success_url: this.conf.successUrl,
			metadata: {
				user_id: user.id,
				user_email: user.email,
				user_name: user.name,
				user_image: user.image,
			},
		});

		// Let's do it concurrently
		const [price, session] = await Promise.all([pricePromise, sessionPromise]);

		console.info("Fetched price", price.id);
		console.debug(price);
		console.info(`Fetched new checkout ${session.id} for user ${user.id}`);
		console.debug(session);

		const checkoutInsert: CheckoutInsert = {
			id: session.id,
			userId: user.id,
			session: session,
			price: price,
			event: null,
		};

		console.info(`Inserting checkout ${session.id} into database`);
		const [dbCheckout] = await this.tx
			.insert(Checkouts)
			.values(checkoutInsert)
			.returning();
		console.info(`Inserted checkout ${dbCheckout.id} into database`);
		console.debug(dbCheckout);

		return dbCheckout;
	}

	/**
	 * Handles the webhook event when a checkout session is completed
	 */
	async webhook(
		event: Stripe.Event,
	): Promise<void> {
		if (event.type == "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;
			if (!session.client_reference_id)
				return;
			console.info(`User to update ${session.client_reference_id}`);

			if (!session.subscription) {
				console.error(`No subscription found for session ${session.id}`);
				return;
			}

			const metadata = await this.getMetadataProduct(session.subscription as string)
			const value_images = metadata.monthly_images || metadata.yearly_images;
			const value_models = metadata.monthly_models || metadata.yearly_models;

			const user_id = session.client_reference_id.replace(/_/g, '|');
			console.info(`Adding imageCredits and trainingCredits to user ${user_id}`);
			const [userDb] = await this.tx
				.update(Users)
				.set({
					imageCredits: sql`${value_images}`,
					trainingCredits: sql`${value_models}`,
					idStripe: `${session.customer}`
				})
				.where(eq(Users.id, user_id))
				.returning();
			console.info(`Added imageCredits and trainingCredits to user ${userDb.id}`);
			console.debug(`Total imageCredits: ${userDb.imageCredits}`);
			console.debug(`Total trainingCredits: ${userDb.trainingCredits}`);
		}

		if (event.type == "invoice.paid") {
			const invoice = event.data.object as Stripe.Invoice;
			if (invoice.billing_reason !== "subscription_cycle")
				return;

			if (!invoice.subscription) {
				console.error(`No subscription found for session ${invoice.id}`);
				return;
			}

			const productMetadata = await this.getMetadataProduct(invoice.subscription as string);
			const value_images = productMetadata.monthly_images || productMetadata.yearly_images;
			const value_models = productMetadata.monthly_models || productMetadata.yearly_models;
			const [userDb] = await this.tx
				.update(Users)
				.set({
					imageCredits: sql`${value_images}`,
					trainingCredits: sql`${value_models}`,
				})
				.where(eq(Users.idStripe, invoice.customer as string))
				.returning();
			console.info(`Added imageCredits and trainingCredits to user ${userDb.id}`);
			console.debug(`Total imageCredits: ${userDb.imageCredits}`);
			console.debug(`Total trainingCredits: ${userDb.trainingCredits}`);
		}
	}

	private async getMetadataProduct(idSubscription: string): Promise<Stripe.Metadata> {
		const subscription = await this.stripe.subscriptions.retrieve(idSubscription);
		const product_id = subscription.items?.data[0]?.plan?.product;
		const product = await this.stripe.products.retrieve(product_id as string);
		return product.metadata
	}


}

export const useServerStripe = (event?: H3Event): Stripe => {
	const config = useRuntimeConfig(event);
	return new Stripe(config.stripe.secretKey);
};

export const createStripeCheckoutService = (
	tx: DB,
	event?: H3Event,
): StripeCheckoutService => {
	const stripe = useServerStripe(event);
	const config = useRuntimeConfig(event);
	return new StripeCheckoutService(stripe, tx, config.stripe);
};
