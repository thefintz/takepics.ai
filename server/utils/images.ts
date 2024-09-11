import { eq } from "drizzle-orm";
import { Creations, Images, db } from "./db";
import { useServerReplicate } from "./replicate";

interface CreateImage {
	url: string;
	userId: string;
	caption: string;
	webhook: string;
}

export const insertImage = async (
	props: CreateImage,
): Promise<ImageWithCreation> => {
	console.info("Creating image", props);
	const replicate = useServerReplicate();

	console.info("Creating prediction for image: ", props);
	const prediction = await replicate.predictions.create({
		model: "black-forest-labs/flux-dev",
		input: { url: props.url, prompt: props.caption },
		webhook: props.webhook,
	});

	return await db.transaction(async (tx) => {
		console.info("Inserting image", props.url);
		const [image] = await tx
			.insert(Images)
			.values({ url: props.url, userId: props.userId, caption: props.caption })
			.returning();
		console.info("Inserted image", image.id);
		console.debug(image);

		console.info("Inserting creation for image", image.id);
		const [creation] = await tx
			.insert(Creations)
			.values({ id: prediction.id, imageId: image.id, data: prediction })
			.returning();
		console.info("Inserted creation", creation.id);
		console.debug(creation);

		return { ...image, creation };
	});
};

interface FetchImages {
	userId: string;
}

export const fetchImages = async (
	props: FetchImages,
): Promise<ImageWithCreation[]> => {
	console.info("Fetching images for user", props.userId);
	const items = await db
		.select()
		.from(Images)
		.leftJoin(Creations, eq(Images.id, Creations.imageId))
		.where(eq(Images.userId, props.userId));
	console.info(`Fetched ${items.length} images for user ${props.userId}`);
	console.debug(items);

	const images = items.map(({ images, creations }) => ({
		...images,
		creation: creations,
	}));

	return images as ImageWithCreation[];
};
