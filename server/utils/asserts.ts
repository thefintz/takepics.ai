import { getServerSession } from "#auth";
import type { H3Event } from "h3";
import { validateWebhook } from "replicate";

export const assertAuthenticated = async (
	event: H3Event,
): Promise<UserSelect> => {
	const session = await getServerSession(event);

	if (!session) {
		console.warn("No session");
		console.debug(session);
		throw createError({ status: 401, message: "unauthenticated" });
	}

	if (!session.user) {
		console.warn("No user");
		console.debug(session);
		throw createError({ status: 401, message: "unauthenticated" });
	}

	return session.user;
};

export const assertValidReplicateWebhook = async <T>(
	event: H3Event,
): Promise<T> => {
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
		const parsed = JSON.parse(body) as T;
		console.info("parsed", parsed);
		return parsed;
	} catch (e) {
		console.warn("Error parsing webhook body", e);
		throw createError({ status: 400, message: "Invalid JSON body" });
	}
};
