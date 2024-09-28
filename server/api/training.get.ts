import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
	const user = await assertAuthenticated(event);

	return db.transaction(async (tx) => {
		const service = createTrainingService(tx, event);
		return await service.list(user);
	});
});
