import type { H3Event } from "h3";

export const getReplicateWebhook = (event?: H3Event) => {
	const config = useRuntimeConfig(event);
	return config.replicate.webhookUrl;
};
