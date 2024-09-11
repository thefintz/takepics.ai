import { getServerSession } from "#auth";
import type { User } from "../utils/db";
import { fetchUser } from "../utils/users";

export default defineEventHandler(async (event): Promise<User> => {
	const session = await getServerSession(event);

	// If session is null, it means we are not authenticated
	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	return await fetchUser(session.user.id);
});
