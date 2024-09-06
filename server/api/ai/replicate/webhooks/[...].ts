import Replicate from "replicate";
import { defineWebhookReplicateHandler } from "~/server/utils/webhooks/replicate";

const config = useRuntimeConfig();

const replicate = new Replicate({
	auth: config.replicate.apiToken,
});

export default defineWebhookReplicateHandler({
	secret: config.replicate.webhookSecret,
	handler: async (prediction) => {
		console.log("prediction", prediction);
	},
});
