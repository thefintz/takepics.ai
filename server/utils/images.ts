import { db, Images, Creations } from "./db";
import { eq } from "drizzle-orm";
interface CreateImage {
	url: string;
	userId: string;
	caption: string;
	webhook?: string;
}

export const createImage = async (props: CreateImage) => {
	console.info("Creating image", props);
	const replicate = useServerReplicate();

	return await db.transaction(async (tx) => {
		console.info("Creating prediction for image: ", props);
		const prediction = replicate.predictions.create({
			model: "black-forest-labs/flux-dev",
			input: { url: props.url, prompt: props.caption },
			webhook: props.webhook,
		});

		console.info("Inserting image", props.url);
		const [image] = await tx
			.insert(Images)
			.values({ url: props.url, userId: props.userId, caption: props.caption })
			.returning();
		console.info("Inserted image", image.id);
		console.debug(image);

		console.info("Inserting creation for image", image.id);
		const [creation] = await db
			.insert(Creations)
			.values({ imageId: image.id, data: await prediction })
			.returning();
		console.info("Inserted creation", creation.id);
		console.debug(creation);

		return { ...image, creation };
	});
};

interface FetchImages {
	userId: string;
}

export const fetchImages = async (props: FetchImages) => {
	console.info("Fetching images for user", props.userId);
	const items = await db
		.select()
		.from(Images)
		.leftJoin(Creations, eq(Images.id, Creations.imageId))
		.where(eq(Images.userId, props.userId));
	console.info(`Fetched ${items.length} images for user ${props.userId}`);
	console.debug(items);

	return items.map(({ images, creations }) => ({
		...images,
		creation: creations,
	}));
};
