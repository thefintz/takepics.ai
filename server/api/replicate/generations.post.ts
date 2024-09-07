import { getServerSession } from "#auth";
import { z } from "zod";
import { createImage } from "../../utils/images";
import { getServerWebhook } from "../../utils/webhooks";

const schema = z.object({
	url: z.string().url(),
	caption: z.string().min(1).max(256),
});

export default defineEventHandler(async (event) => {
	const session = await getServerSession(event);

	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	const body = await readValidatedBody(event, (body) => schema.parse(body));

	return await createImage({
		userId: session.user.id,
		url: body.url,
		caption: body.caption,
		webhook: getServerWebhook("replicate"),
	});
});
