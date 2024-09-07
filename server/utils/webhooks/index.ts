export const getServerWebhook = (path: string) => {
	const url = useRequestURL();
	return `https://${url.host}/api/webhooks/${path}`;
};
