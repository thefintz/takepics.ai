import { validateWebhook, type Prediction } from "replicate";
import type { EventHandlerRequest, H3Event } from "h3";

interface Props {
	handler: (
		props: Prediction,
		event?: H3Event<EventHandlerRequest>,
	) => void | Promise<void>;
}

export const defineWebhookReplicateHandler = ({ handler }: Props) => {
	/**
	 * This wrapper does ALL validations and error handling for the webhook.
	 *
	 * The last thing, literally the last thing we do, is to call the handler with
	 * the successfully validated `Prediction` object. Please, let keep this
	 * pattern going as it makes things super easy to debug
	 */
	const h = defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
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

		const id = event.headers.get("webhook-id");
		const timestamp = event.headers.get("webhook-timestamp");
		const signature = event.headers.get("webhook-signature");

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

		let prediction: Prediction;
		try {
			// We can safely parse as Prediction because, if it passed the signature
			// validation, it must have the correct shape. In other situations, better
			// to use `zod`
			prediction = JSON.parse(body);
		} catch (e) {
			console.warn(e);
			throw createError({ status: 400, message: "Invalid JSON body" });
		}

		// Finally, we call the handler with the prediction
		return await handler(prediction, event);
	});

	return h;
};
