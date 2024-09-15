import { z } from "zod";
import { createUsersService } from "~/server/utils/services/users";

const schema = z.object({
	url: z.string().url(),
	caption: z.string().min(0).max(256).default(""),
});

export default defineEventHandler(async (event): Promise<ImageWithCreation> => {
	const user = await assertAuthenticated(event);
	const body = await readValidatedBody(event, (body) => schema.parse(body));

	if (user.credits <= 0) {
		console.info(`User ${user.id} has no credits: ${user.credits}`);
		throw createError({ statusCode: 400, statusMessage: "not enough credits" });
	}

	return await db.transaction(async (tx) => {
		const users = createUsersService(tx, event);
		const images = createReplicateImageService(tx, event);

		const image = await images.create(user, body.url, body.caption);

		user.credits -= 1;
		await users.update(user);

		return image;
	});
});
