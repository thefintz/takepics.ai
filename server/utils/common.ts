export const toBase64 = async (file: Blob) => {
	const array = await file.arrayBuffer();
	const buffer = Buffer.from(array);
	return buffer.toString("base64");
};
