import { getServerSession } from "#auth";

type User = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export default eventHandler(async (event): Promise<User> => {
	const session = await getServerSession(event);

	// If session is null, it means we are not authenticated
	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	return session.user;
});
