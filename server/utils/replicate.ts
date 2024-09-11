import type { H3Event } from "h3";
import Replicate from "replicate";

export const useServerReplicate = (event?: H3Event) => {
	const config = useRuntimeConfig(event);
	return new Replicate({ auth: config.replicate.apiToken });
};

export const getReplicateWebhook = (event?: H3Event) => {
	const config = useRuntimeConfig(event);
	return config.replicate.webhookUrl;
};
