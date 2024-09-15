export default defineEventHandler(async (event): Promise<UserSelect> => {
	const user = await assertAuthenticated(event);

	const userDb = await db.transaction(async (tx) => {
		const service = createUserService(tx, event);
		return await service.fetch(user.id);
	});

	if (!userDb) {
		throw createError({ status: 404, message: `user ${user.id} not found` });
	}

	return user;
});
