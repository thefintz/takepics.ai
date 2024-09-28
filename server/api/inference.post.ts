import { z } from "zod";
import { createReplicateInferenceService } from "~/server/utils/services/inference";
import { createUsersService } from "~/server/utils/services/users";

const schema = z.object({
	prompt: z.string().min(5).max(512),
	lora: z.string().min(1).max(512)
});

export default defineEventHandler(async (event): Promise<CreationSelect> => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (body) => schema.parse(body));

	if (user.credits <= 0) {
		console.info(`User ${user.id} has no credits: ${user.credits}`);
		throw createError({ statusCode: 400, statusMessage: "not enough credits" });
	}

	return await db.transaction(async (tx) => {
		const users = createUsersService(tx, event);
		const images = createReplicateInferenceService(tx, event);

		const image = await images.create(user, body.prompt, body.lora);

		user.credits -= 1;
		await users.update(user);

		return image;
	});
});
