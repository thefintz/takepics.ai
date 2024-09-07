import { getServerSession } from "#auth";
import { fetchImages } from "@/server/utils/images";
import type { ImageWithCreation } from "@/server/utils/db";

export default defineEventHandler(
	async (event): Promise<ImageWithCreation[]> => {
		const session = await getServerSession(event);

		if (!session?.user) {
			throw createError({ status: 401, message: "unauthenticated" });
		}

		return await fetchImages({ userId: session.user.id });
	},
);
