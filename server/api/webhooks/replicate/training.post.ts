import type { Training } from "replicate";
import { assertValidReplicateWebhook } from "~/server/utils/asserts";

export default defineEventHandler(async (event): Promise<string> => {
	const training = await assertValidReplicateWebhook<Training>(event);
	console.info(`Received training event: ${training.id} - ${training.status}`);
	console.info(training);

	db.transaction(async (tx) => {
		const service = createTrainingService(tx, event);
		return await service.update(training);
	});

	return "OK";
});
