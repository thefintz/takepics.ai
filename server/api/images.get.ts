import { getServerSession } from "#auth";
import { fetchImages } from "../utils/images";

export default defineEventHandler(async (event) => {
	const session = await getServerSession(event);

	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	return await fetchImages({ userId: session.user.id });
});
