import { getServerSession } from "#auth";
import { createCheckout } from "@/server/utils/checkouts";

export default defineEventHandler(async (event): Promise<void> => {
	const session = await getServerSession(event);

	if (!session?.user) {
		throw createError({ status: 401, message: "unauthenticated" });
	}

	const config = useRuntimeConfig(event);

	const checkout = await createCheckout(session.user, {
		mode: "payment",
		line_items: [{ price: config.stripe.priceId, quantity: 1 }],
		success_url:
			"https://e348-2804-1b3-8401-857-90c-b8cd-279c-840.ngrok-free.app",
	});

	if (!checkout.session.url) {
		console.error("Invalid session. No redirect URL returned");
		throw createError({
			status: 500,
			message: "Failed to create checkout session",
		});
	}

	return await sendRedirect(event, checkout.session.url);
});
