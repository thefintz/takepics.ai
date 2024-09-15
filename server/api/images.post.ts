import { z } from "zod";

const schema = z.object({
	url: z.string().url(),
	caption: z.string().min(0).max(256).default(""),
});

export default defineEventHandler(async (event): Promise<ImageWithCreation> => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (body) => schema.parse(body));

	return await db.transaction(async (tx) => {
		const service = createReplicateImageService(tx, event);
		return await service.create(user, body.url, body.caption);
	});
});
