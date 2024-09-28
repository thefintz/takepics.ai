import type { H3Event } from "h3";
import { z } from "zod";

const schema = z.object({
	zip: z.string(),
	gender: z.enum(["male", "female", "other"]),
	eyeColor: z.enum(["blue", "brown", "green", "gray", "other"]),
	trainingType: z.enum(["person", "object"]),
});

export default defineEventHandler(async (event: H3Event) => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (i) => schema.parse(i));

	return db.transaction(async (tx) => {
		const service = createTrainingService(tx, event);
		return await service.start(user, body.zip);
	});
});
