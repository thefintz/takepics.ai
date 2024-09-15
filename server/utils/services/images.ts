import { eq } from "drizzle-orm";
import type { H3Event } from "h3";
import Replicate from "replicate";
import type { DB } from "~/server/utils/db/client";
import { Creations, Images } from "~/server/utils/db/schema";

export interface ImagesService {
	create(
		user: UserSelect,
		url: string,
		caption: string,
	): Promise<ImageWithCreation>;
	fetch(id: string): Promise<ImageWithCreation>;
	list(userId: string): Promise<ImageWithCreation[]>;
}

interface ReplicateImageServiceConf {
	model: string;
	webhookUrl: string;
}

export class ReplicateImageService implements ImagesService {
	private readonly tx: DB;
	private readonly replicate: Replicate;
	private readonly conf: ReplicateImageServiceConf;

	constructor(tx: DB, replicate: Replicate, conf: ReplicateImageServiceConf) {
		this.tx = tx;
		this.replicate = replicate;
		this.conf = conf;
	}

	async create(
		user: UserSelect,
		url: string,
		caption: string,
	): Promise<ImageWithCreation> {
		console.info(`Creating prediction for user ${user.id}`);
		const prediction = await this.replicate.predictions.create({
			model: this.conf.model,
			input: { url: url, prompt: caption },
			webhook: this.conf.webhookUrl,
		});
		console.info(`Created prediction ${prediction.id} for user ${user.id}`);
		console.debug(prediction);

		console.info(`Inserting image ${url} for user ${user.id}`);
		const [image] = await this.tx
			.insert(Images)
			.values({ url, userId: user.id, caption })
			.returning();
		console.info(`Inserted image ${image.id} for user ${user.id}`);
		console.debug(image);

		console.info("Inserting creation for image", image.id);
		const [creation] = await this.tx
			.insert(Creations)
			.values({ id: prediction.id, imageId: image.id, data: prediction })
			.returning();
		console.info("Inserted creation", creation.id);
		console.debug(creation);

		return { ...image, creation };
	}

	async fetch(id: string): Promise<ImageWithCreation> {
		const [{ images, creations }] = await this.tx
			.select()
			.from(Images)
			.leftJoin(Creations, eq(Images.id, Creations.imageId))
			.where(eq(Images.id, id))
			.limit(1);

		if (!creations) {
			throw new Error(`Creation not found for image ${id}. Expected one`);
		}

		return { ...images, creation: creations };
	}

	async list(userId: string): Promise<ImageWithCreation[]> {
		console.info(`Fetching images for user ${userId}`);
		const items = await this.tx
			.select()
			.from(Images)
			.leftJoin(Creations, eq(Images.id, Creations.imageId))
			.where(eq(Images.userId, userId));
		console.info(`Fetched ${items.length} images for user ${userId}`);
		console.debug(items);

		const result: ImageWithCreation[] = [];
		for (const { images, creations } of items) {
			if (!creations) {
				throw new Error(`Unexpectedly missing creation for image ${images.id}`);
			}
			result.push({ ...images, creation: creations });
		}

		return result;
	}
}

export const useServerReplicateClient = (event?: H3Event): Replicate => {
	const conf = useRuntimeConfig(event);
	return new Replicate({ auth: conf.replicate.apiToken });
};

export const createReplicateImageService = (
	tx: DB,
	event?: H3Event,
): ImagesService => {
	const conf = useRuntimeConfig(event);
	const replicate = useServerReplicateClient(event);
	return new ReplicateImageService(tx, replicate, conf.replicate);
};
