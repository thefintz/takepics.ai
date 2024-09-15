export default defineEventHandler(
	async (event): Promise<ImageWithCreation[]> => {
		const user = await assertAuthenticated(event);

		return db.transaction(async (tx) => {
			const service = createReplicateImageService(tx, event);
			return await service.list(user.id);
		});
	},
);
