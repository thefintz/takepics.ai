import { and, desc, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import Replicate, { type Prediction } from "replicate";
import type { DB } from "~/server/utils/db/client";
import { Creations } from "~/server/utils/db/schema";
import { useServerStorageService, type StorageService } from "./storage";
import type { TrainingService } from "./training";

export interface InferenceService {
	create(
		user: UserSelect,
		prompt: string,
		lora: string,
	): Promise<CreationSelect>;
	fetch(userId: string, creationId: string): Promise<CreationSelect>;
	list(userId: string): Promise<CreationSelect[]>;
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
	): Promise<CreationSelect> {
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

		console.info(`Inserting creation ${prediction.id} for user ${user.id}`);
		const [creation] = await this.tx
			.insert(Creations)
			.values({
				id: prediction.id,
				userId: user.id,
				prompt: prompt,
				data: prediction,
			})
			.returning();
		console.info("Inserted creation", creation.id);
		console.debug(creation);

		return creation;
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

	async update(data: Prediction): Promise<CreationSelect> {
		const image = await this.#syncImage(data);

		console.info(`Updating creation ${data.id}`);
		console.debug(data);
		const [creation] = await this.tx
			.update(Creations)
			.set({ data, url: image.url.publicUrl })
			.where(eq(Creations.id, data.id));
		console.info(`Updated creation ${data.id}`);
		console.debug(creation);

		return creation;
	}

	async fetch(userId: string, creationId: string): Promise<CreationSelect> {
		console.info(`Fetching image ${creationId} for user ${userId}`);
		const creations = await this.tx
			.select()
			.from(Creations)
			.where(and(eq(Creations.userId, userId), eq(Creations.id, creationId)));
		console.info(`Fetched ${creations.length} images for user ${userId}`);
		console.debug(creations);

		if (!creations) {
			throw new Error(
				`Creation not found for image ${creationId}. Expected one`,
			);
		}

		return creations[0];
	}

	async list(userId: string): Promise<CreationSelect[]> {
		console.info(`Fetching images for user ${userId}`);
		const items = await this.tx
			.select()
			.from(Creations)
			.where(eq(Creations.userId, userId))
			.orderBy(desc(Creations.createdAt));
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
