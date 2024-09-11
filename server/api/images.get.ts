import { getServerSession } from "#auth";
import type { ImageWithCreation } from "@/server/utils/db";
import { fetchImages } from "@/server/utils/images";

export default defineEventHandler(
	async (event): Promise<ImageWithCreation[]> => {
		const session = await getServerSession(event);

		if (!session?.user) {
			throw createError({ status: 401, message: "unauthenticated" });
		}

		return await fetchImages({ userId: session.user.id });
	},
);
