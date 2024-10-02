import { and, desc, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import Replicate, { type Prediction } from "replicate";
import type { DB } from "~/server/utils/db/client";
import { Images } from "~/server/utils/db/schema";
import { useServerStorageService, type StorageService } from "./storage";
import type { TrainingService } from "./training";

export interface InferenceService {
	create(
		user: UserSelect,
		prompt: string,
		lora: string,
	): Promise<ImageSelect>;
	fetch(userId: string, imageId: string): Promise<ImageSelect>;
	list(userId: string): Promise<ImageSelect[]>;
}

interface ReplicateImageServiceConf {
	model: string;
	version: string;
	webhookUrl: string;
}

export class ReplicateInferenceImageService implements InferenceService {
	private readonly tx: DB;
	private readonly replicate: Replicate;
	private readonly trainings: TrainingService;
	private readonly storage: StorageService;
	private readonly conf: ReplicateImageServiceConf;

	constructor(
		tx: DB,
		replicate: Replicate,
		trainings: TrainingService,
		storage: StorageService,
		conf: ReplicateImageServiceConf,
	) {
		this.tx = tx;
		this.replicate = replicate;
		this.trainings = trainings;
		this.storage = storage;
		this.conf = conf;
	}

	async create(
		user: UserSelect,
		prompt: string,
		model: string,
	): Promise<ImageSelect> {
		console.info(`Creating inference for user ${user.id}`);

		const training = await this.trainings.fetch(model);
		if (!training.weights_url) {
			console.error(`Training ${training.id} has no weights URL`);
			console.debug(training);
			throw new Error(`Training ${training.id} has no weights URL`);
		}

		console.info(`Creating prediction for training ${training.id}`);
		const prediction = await this.replicate.predictions.create({
			model: this.conf.model,
			version: this.conf.version,
			webhook: `${this.conf.webhookUrl}/inference`,
			input: {
				prompt: prompt,
				hf_lora: training.weights_url,
				output_format: "png",
				lora_scale: 0.8,
				aspect_ratio: "2:3",
				guidance_scale: 3.5,
				prompt_strength: 0.8,
				num_inference_steps: 28,
				disable_safety_checker: true,
			},
		});
		console.info(
			`Created prediction ${prediction.id} for training ${training.id}`,
		);
		console.debug(prediction);

		console.info(`Inserting image ${prediction.id} for user ${user.id}`);
		const [image] = await this.tx
			.insert(Images)
			.values({
				id: prediction.id,
				userId: user.id,
				prompt: prompt,
				data: prediction,
			})
			.returning();
		console.info("Inserted image", image.id);
		console.debug(image);

		return image;
	}

	async #syncImage(prediction: Prediction) {
		const url = prediction.output?.[0];

		if (!url) {
			console.error(`Prediction ${prediction.id} has no image`);
			console.debug(prediction);
			throw new Error(`Prediction ${prediction.id} has no image`);
		}

		console.info(`Fetching image ${url}`);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		console.info(`Fetched image ${url}`);
		console.debug("Image size:", buffer.length);

		return await this.storage.uploadImage(`image_${prediction.id}.png`, buffer);
	}

	async update(data: Prediction): Promise<ImageSelect> {
		const updatedImage = await this.#syncImage(data);

		console.info(`Updating image ${data.id}`);
		console.debug(data);
		const [image] = await this.tx
			.update(Images)
			.set({ data, url: updatedImage.url.publicUrl })
			.where(eq(Images.id, data.id));
		console.info(`Updated image ${data.id}`);
		console.debug(image);

		return image;
	}

	async fetch(userId: string, imageId: string): Promise<ImageSelect> {
		console.info(`Fetching image ${imageId} for user ${userId}`);
		const images = await this.tx
			.select()
			.from(Images)
			.where(and(eq(Images.userId, userId), eq(Images.id, imageId)));
		console.info(`Fetched ${images.length} images for user ${userId}`);
		console.debug(images);

		if (!images) {
			throw new Error(
				`Image not found for image ${imageId}. Expected one`,
			);
		}

		return images[0];
	}

	async list(userId: string): Promise<ImageSelect[]> {
		console.info(`Fetching images for user ${userId}`);
		const items = await this.tx
			.select()
			.from(Images)
			.where(eq(Images.userId, userId))
			.orderBy(desc(Images.createdAt));
		console.info(`Fetched ${items.length} images for user ${userId}`);
		console.debug(items);

		return items;
	}
}

export const useServerReplicateClient = (event?: H3Event): Replicate => {
	const conf = useRuntimeConfig(event);
	return new Replicate({ auth: conf.replicate.apiToken });
};

export const useServerInferenceService = (
	tx: DB,
	event?: H3Event,
): ReplicateInferenceImageService => {
	const conf = useRuntimeConfig(event);
	const replicate = useServerReplicateClient(event);
	const trainings = createTrainingService(tx, event);
	const storage = useServerStorageService(event);

	return new ReplicateInferenceImageService(
		tx,
		replicate,
		trainings,
		storage,
		conf.replicate,
	);
};
