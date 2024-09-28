import { z } from "zod";
import { useServerInferenceService } from "~/server/utils/services/inference";

const schema = z.object({
	prompt: z.string().min(5).max(512),
	model: z.string().min(5).max(32),
});

export default defineEventHandler(async (event): Promise<CreationSelect> => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (body) => schema.parse(body));

	return await db.transaction(async (tx) => {
		const service = useServerInferenceService(tx, event);
		const image = await service.create(user, body.prompt, body.model);
		return image;
	});
});
