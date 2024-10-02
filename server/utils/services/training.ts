import { desc, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import type Replicate from "replicate";
import type { Model, Training } from "replicate";
import type { DB } from "../db/client";
import type { ModelSelect } from "../db/schema";
import { Models } from "../db/schema";
import { useServerReplicateClient } from "./inference";
import { useServerStorageService, type StorageService } from "./storage";

export class TrainingService {
  private readonly db: DB;
  private readonly owner: string;
  private readonly client: Replicate;
  private readonly storage: StorageService;
  private readonly webhookUrl: string;

  constructor(
    db: DB,
    client: Replicate,
    owner: string,
    storage: StorageService,
    webhookUrl: string,
  ) {
    this.db = db;
    this.client = client;
    this.owner = owner;
    this.storage = storage;
    this.webhookUrl = webhookUrl;
  }

  async createModel(name: string): Promise<Model> {
    console.info("Creating model:", name);
    const model = await this.client.models.create(this.owner, name, {
      visibility: "public",
      // replicate ignora pra esse modelo (Flux) e direciona pra H100, que
      // ainda não é opção na API.
      hardware: "gpu-a100-large",
    });
    console.info("Created model:", model.name);
    console.debug(model);
    return model;
  }

  async start(user: UserSelect, zip: string, customName: string, gender: string, eyeColor: string, trainingType: string): Promise<ModelSelect> {
    // Create a new model for this training
    const date = new Date().getTime();
    const id = user.id.replace("|", "_");

    const name = `training_${date}_${id}`;
    const fileName = `${name}.zip`;
    const model = await this.createModel(name);

    const upload = await this.storage.uploadZip(fileName, zip);

    // Start training on Replicate
    console.info("Starting training:", name);
    const response = await this.client.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "6f1e7ae9f285cfae6e12f8c18618418cfefe24b07172a17ff10a64fb23a6b772",
      {
        destination: `${this.owner}/${name}`,
        webhook: `${this.webhookUrl}/training`,
        input: {
          steps: 10,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          input_images: upload.url.publicUrl,
          trigger_word: "TOK",
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100,
        },
      },
    );
    console.info("Started training:", response.id);
    console.debug(response);

    // Save training data to database
    console.info("Saving training to database:", response.id);
    const [training] = await this.db
      .insert(Models)
      .values({
        id: response.id,
        customName: customName,
        userId: user.id,
        zipUrl: upload.url.publicUrl,
        modelResponseData: model,
        trainingResponseData: response,
        gender: gender,
        eyeColor: eyeColor,
        trainingType: trainingType
      })
      .returning();
    console.info("Saved training to database:", training.id);
    console.debug(training);

    return training;
  }

  async list(user: UserSelect): Promise<ModelSelect[]> {
    console.info("Fetching models for user:", user.id);
    const models = await this.db
      .select()
      .from(Models)
      .where(eq(Models.userId, user.id))
      .orderBy(desc(Models.createdAt));
    const log = `Fetched ${models.length} models for user: ${user.id}`;
    console.info(log);
    console.debug(models);

    return models;
  }

  async fetch(id: string): Promise<ModelSelect> {
    console.info("Fetching training:", id);
    const [model] = await this.db
      .select()
      .from(Models)
      .where(eq(Models.id, id));

    if (!model) {
      console.warn(`Model not found: ${id}`);
      throw new Error(`Model not found: ${id}`);
    }

    const log = `Fetched model: ${model.id}`;
    console.info(log);
    console.debug(model);

    return model;
  }

  async update(trainingResponseData: Training): Promise<ModelSelect> {
    console.info("Updating training:", trainingResponseData.id);
    const weights_url = trainingResponseData.output?.weights;
    const [updatedModel] = await this.db
      .update(Models)
      .set({ trainingResponseData, weights_url })
      .where(eq(Models.id, trainingResponseData.id))
      .returning();
    console.info("Updated model:", updatedModel.id);
    console.debug(updatedModel);
    return updatedModel;
  }
}

export const createTrainingService = (
  db: DB,
  event?: H3Event,
): TrainingService => {
  const config = useRuntimeConfig(event);
  const replicate = useServerReplicateClient(event);
  const storage = useServerStorageService(event);

  return new TrainingService(
    db,
    replicate,
    config.replicate.username,
    storage,
    config.replicate.webhookUrl,
  );
};
