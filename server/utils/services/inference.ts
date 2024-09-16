import { eq, and } from "drizzle-orm";
import type { H3Event } from "h3";
import Replicate from "replicate";
import type { DB } from "~/server/utils/db/client";
import { Creations } from "~/server/utils/db/schema";

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
	private readonly conf: ReplicateImageServiceConf;

	constructor(tx: DB, replicate: Replicate, conf: ReplicateImageServiceConf) {
		this.tx = tx;
		this.replicate = replicate;
		this.conf = conf;
	}

	async create(
		user: UserSelect,
		prompt: string,
		lora: string,
	): Promise<CreationSelect> {
		console.info(`Creating inference for user ${user.id}`);
		console.debug(this.conf)
		const prediction = await this.replicate.predictions.create({
			model: this.conf.model,
			version: this.conf.version,
			input: { prompt: prompt, hf_lora: lora, output_format: 'png'},
			webhook: this.conf.webhookUrl,
		});
		console.info(`Created prediction ${prediction.id} for user ${user.id}`);
		console.debug(prediction);

		const [creation] = await this.tx
			.insert(Creations)
			.values({
				id: prediction.id,
				userId: user.id,
				prompt: prompt,
				data: prediction })
			.returning();
		console.info("Inserted creation", creation.id);
		console.debug(creation);

		return creation;
	}

	async fetch(userId: string, creationId: string): Promise<CreationSelect> {
		console.info(`Fetching image ${creationId} for user ${userId}`);
		const creations = await this.tx
			.select()
			.from(Creations)
			.where(and(eq(Creations.userId, userId),eq(Creations.id, creationId)));
		console.info(`Fetched ${creations.length} images for user ${userId}`);
		console.debug(creations);

		if (!creations) {
			throw new Error(`Creation not found for image ${creationId}. Expected one`);
		}

		return creations[0]
	}



	async list(userId: string): Promise<CreationSelect[]> {
		console.info(`Fetching images for user ${userId}`);
		const items = await this.tx
			.select()
			.from(Creations)
			.where(eq(Creations.userId, userId));
		console.info(`Fetched ${items.length} images for user ${userId}`);
		console.debug(items);

		return items
	}
}

export const useServerReplicateClient = (event?: H3Event): Replicate => {
	const conf = useRuntimeConfig(event);
	return new Replicate({ auth: conf.replicate.apiToken });
};

export const createReplicateInferenceService = (
	tx: DB,
	event?: H3Event,
): ReplicateInferenceImageService => {
	const conf = useRuntimeConfig(event);
	const replicate = useServerReplicateClient(event);
	return new ReplicateInferenceImageService(tx, replicate, conf.replicate);
};
