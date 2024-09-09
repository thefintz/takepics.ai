import type { H3Event } from "h3";
import Stripe from "stripe";
import { db, Checkouts } from "@/server/utils/db";
import { eq } from "drizzle-orm";

const assertValidWebhook = async (event: H3Event): Promise<Stripe.Event> => {
	const config = useRuntimeConfig(event);

	if (!config.stripe.webhookSecret) {
		console.warn("Missing webhook secret");
		throw createError({ status: 503, message: "Service unavailable" });
	}

	if (event.method !== "POST") {
		console.warn(`Method ${event.method} not allowed`);
		throw createError({
			status: 405,
			message: `Method ${event.method} not allowed`,
		});
	}

	const signature = getHeader(event, "stripe-signature");

	if (!signature) {
		console.warn("Missing signature");
		throw createError({ status: 400, message: "Missing signature" });
	}

	const body = await readRawBody(event);

	if (!body) {
		console.warn("Missing body");
		throw createError({ status: 400, message: "Missing body" });
	}

	const stripe = new Stripe(config.stripe.apiToken);

	try {
		return stripe.webhooks.constructEvent(
			body,
			signature,
			config.stripe.webhookSecret,
		);
	} catch (err) {
		console.warn("Error validating webhook", err);
		throw createError({ status: 403, message: "Invalid signature" });
	}
};

export default defineEventHandler(async (event): Promise<string> => {
	const data = await assertValidWebhook(event);
	console.info(`Received event: ${data.id} - ${data.type}`);
	console.debug(data);

	if (data.type !== "checkout.session.completed") {
		console.warn(`Ignoring event: ${data.id} - ${data.type}`);
		return "OK";
	}

	const session = data.data.object;

	console.info("Updating checkout", session.id);
	await db
		.update(Checkouts)
		.set({ event: data })
		.where(eq(Checkouts.id, session.id))
		.returning();
	console.info("Updated checkout", session.id);

	return "OK";
});
