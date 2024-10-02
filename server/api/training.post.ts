import type { H3Event } from "h3";
import { z } from "zod";

const schema = z.object({
	zip: z.string(),
	gender: z.enum(["male", "female", "other"]),
	eyeColor: z.enum(["blue", "brown", "green", "gray", "other"]),
	trainingType: z.enum(["person", "object"]),
	customName: z.string(),
});

export default defineEventHandler(async (event: H3Event) => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (i) => schema.parse(i));

	if (user.trainingCredits <= 0) {
		console.info(`User ${user.id} has no trainingCredits: ${user.trainingCredits}`);
		throw createError({ statusCode: 400, statusMessage: "not enough trainingCredits" });
	}

	return db.transaction(async (tx) => {
		const users = createUsersService(tx, event);
		const service = createTrainingService(tx, event);

		const training = await service.start(user, body.zip, body.customName, body.gender, body.eyeColor, body.trainingType);

		user.trainingCredits -= 1;
		await users.update(user);

		return training;
	});
});
