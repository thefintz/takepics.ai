import { defineWebhookReplicateHandler } from "../../utils/webhooks/replicate";
import { db, Creations } from "../../utils/db";
import { eq } from "drizzle-orm";

export default defineWebhookReplicateHandler({
	handler: async (prediction) => {
		console.info("Updating creation", prediction);
		await db
			.update(Creations)
			.set({ data: prediction })
			.where(eq(Creations.id, prediction.id));
		console.info("Updated creation", prediction);
	},
});
