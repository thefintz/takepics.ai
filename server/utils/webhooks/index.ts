import { useRequestEvent } from "nuxt/app";

export const getServerWebhook = (path: string) => {
	const event = useRequestEvent();
	const host = event?.headers?.get("host");

	if (!host) {
		throw new Error("Missing host header from request");
	}

	return `https://${host}/api/webhooks/${path}`;
};
