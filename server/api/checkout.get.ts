export default defineEventHandler(async (event): Promise<void> => {
	const user = await assertAuthenticated(event);

	const url = await db.transaction(async (tx) => {
		const service = createStripeCheckoutService(tx, event);
		const checkout = await service.create(user);
		return checkout.session.url;
	});

	if (!url) {
		throw createError({ status: 500, message: "no checkout URL found" });
	}

	return await sendRedirect(event, url);
});
