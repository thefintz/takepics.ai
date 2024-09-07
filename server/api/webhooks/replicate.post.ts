import { db, Creations } from "@/server/utils/db";
import { eq } from "drizzle-orm";
import type { H3Event } from "h3";
import { type Prediction, validateWebhook } from "replicate";

const assertValidWebhook = async (event: H3Event): Promise<Prediction> => {
	const config = useRuntimeConfig();
	const secret = config.replicate.webhookSecret;

	if (!secret) {
		console.warn("Secret is not defined");
		throw createError({ status: 503, message: "Service unavailable" });
	}

	if (event.method !== "POST") {
		console.warn(`Method ${event.method} not allowed`);
		throw createError({
			status: 405,
			message: `Method ${event.method} not allowed`,
		});
	}

	console.info("Reading webhook headers");
	const id = event.headers.get("webhook-id");
	const timestamp = event.headers.get("webhook-timestamp");
	const signature = event.headers.get("webhook-signature");
	console.debug("Read webhook headers", { id, timestamp, signature });

	// For better error messages
	const missing = [];
	if (!id) missing.push("webhook-id");
	if (!timestamp) missing.push("webhook-timestamp");
	if (!signature) missing.push("webhook-signature");

	if (missing.length > 0) {
		console.warn(`Missing webhook headers: ${missing.join(", ")}`);
		throw createError({
			status: 400,
			message: `Missing webhook headers: ${missing.join(", ")}`,
		});
	}

	const body = await readRawBody(event);

	if (!body) {
		console.warn("Missing body");
		throw createError({ status: 400, message: "Missing body" });
	}

	const validation = {
		body,
		secret,
		// We have asserted above that these are not null. So we make typescript
		// happy
		id: id as string,
		timestamp: timestamp as string,
		signature: signature as string,
	};

	const isValid = await validateWebhook(validation, secret);

	if (!isValid) {
		console.warn("Invalid webhook signature");
		throw createError({ status: 403, message: "Invalid webhook signature" });
	}

	try {
		// We can safely cast as Prediction because, if it passed the signature
		// validation, it must have the correct shape. In other situations, better
		// to use `zod`
		return JSON.parse(body) as Prediction;
	} catch (e) {
		console.warn(e);
		throw createError({ status: 400, message: "Invalid JSON body" });
	}
};

export default defineEventHandler(async (event) => {
	const prediction = await assertValidWebhook(event);

	console.info("Updating creation", prediction);
	await db
		.update(Creations)
		.set({ data: prediction })
		.where(eq(Creations.id, prediction.id));
	console.info("Updated creation", prediction);
});
