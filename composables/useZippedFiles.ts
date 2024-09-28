import JSZip from "jszip";

interface File {
	objectURL: string;
	name: string;
}

export const useZippedFiles = async (files: File[]): Promise<string> => {
	const zip = new JSZip();

	const promises = files.map(async (i) => {
		const response = await fetch(i.objectURL);
		const blob = await response.blob();
		zip.file(i.name, blob);
	});

	await Promise.all(promises);

	const zipped = await zip.generateAsync({ type: "blob" });

	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(zipped);
	});
};
