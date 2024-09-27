import { eq } from "drizzle-orm";
import type { H3Event } from "h3";
import { type Prediction, validateWebhook } from "replicate";
import {randomUUID} from "crypto";

const assertValidWebhook = async (event: H3Event): Promise<Prediction> => {
	const config = useRuntimeConfig(event);
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
	const id = getHeader(event, "webhook-id");
	const timestamp = getHeader(event, "webhook-timestamp");
	const signature = getHeader(event, "webhook-signature");
	console.debug("Read webhook headers", { id, timestamp, signature });

	// For better error messages
	const missing: string[] = [];
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
		// We have asserted above that these are not null/undefined. So we make
		// typescript happy
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
		console.warn("Error parsing webhook body", e);
		throw createError({ status: 400, message: "Invalid JSON body" });
	}
};

export default defineEventHandler(async (event): Promise<string> => {
	const prediction = await assertValidWebhook(event);
	console.info(`Received event: ${prediction.id} - ${prediction.status}`);
	console.debug(prediction);

	const response = await fetch(prediction.output?.at(0));
	const imageBuffer = await response.arrayBuffer();
	const uniqueFileName = randomUUID();
	const filePath = `public/${uniqueFileName}.png`;
	const { data, error } = await supabase
		  .storage
		  .from('generated-images')
		  .upload(filePath, Buffer.from(imageBuffer), {
			cacheControl: '3600',
			upsert: false
		  });

	if (!data) {
		return "Erro"
	}

 	const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/generated-images/${filePath}`;

	console.info("Updating creation", prediction.id);
	await db
		.update(Creations)
		.set({ data: prediction, url: publicURL })
		.where(eq(Creations.id, prediction.id));
	console.info("Updated creation", prediction.id);

	return "OK";
});
