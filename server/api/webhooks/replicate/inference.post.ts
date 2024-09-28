import type { Prediction } from "replicate";
import { assertValidReplicateWebhook } from "~/server/utils/asserts";

export default defineEventHandler(async (event): Promise<string> => {
	const pred = await assertValidReplicateWebhook<Prediction>(event);
	console.info(`Received inference event: ${pred.id} - ${pred.status}`);
	console.info(pred);

	await db.transaction(async (tx) => {
		const service = useServerInferenceService(tx, event);
		await service.update(pred);
	});

	return "OK";
});
