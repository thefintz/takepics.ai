import { defineWebhookReplicateHandler } from "../../utils/webhooks/replicate";

export default defineWebhookReplicateHandler({
	handler: async (prediction) => {
		console.info("prediction", prediction);
	},
});
