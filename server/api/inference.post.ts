import { z } from "zod";
import { useServerInferenceService } from "~/server/utils/services/inference";
import { createUsersService } from "~/server/utils/services/users";

const schema = z.object({
	prompt: z.string().min(5).max(512),
	model: z.string().min(5).max(32),
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
		const service = useServerInferenceService(tx, event);
		const image = await service.create(user, body.prompt, body.model);

		user.credits -= 1;
		await users.update(user);
		return image;
	});
});
