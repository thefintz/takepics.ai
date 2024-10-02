export default defineEventHandler(async (event): Promise<ImageSelect[]> => {
	const user = await assertAuthenticated(event);

	return db.transaction(async (tx) => {
		const service = useServerInferenceService(tx, event);
		return await service.list(user.id);
	});
});
