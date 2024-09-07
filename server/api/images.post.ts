import { getServerSession } from "#auth";
import { z } from "zod";
import { insertImage } from "@/server/utils/images";
import { getReplicateWebhook } from "@/server/utils/replicate";

const schema = z.object({
	url: z.string().url(),
	caption: z.string().min(0).max(256).default(""),
});

export default defineEventHandler(async (event): Promise<ImageWithCreation> => {
	const session = await getServerSession(event);

	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	const body = await readValidatedBody(event, (body) => schema.parse(body));

	return await insertImage({
		userId: session.user.id,
		url: body.url,
		caption: body.caption,
		webhook: getReplicateWebhook(event),
	});
});
