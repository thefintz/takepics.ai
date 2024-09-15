import { getServerSession } from "#auth";
import type { H3Event } from "h3";

export const assertAuthenticated = async (
	event: H3Event,
): Promise<UserSelect> => {
	const session = await getServerSession(event);

	if (!session) {
		console.warn("No session");
		console.debug(session);
		throw createError({ status: 401, message: "unauthenticated" });
	}

	if (!session.user) {
		console.warn("No user");
		console.debug(session);
		throw createError({ status: 401, message: "unauthenticated" });
	}

	return session.user;
};
