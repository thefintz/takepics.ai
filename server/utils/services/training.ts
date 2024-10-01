import { desc, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import type Replicate from "replicate";
import type { Model, Training } from "replicate";
import type { DB } from "../db/client";
import type { TrainingSelect } from "../db/schema";
import { Trainings } from "../db/schema";
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

  async model(name: string): Promise<Model> {
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

  async start(user: UserSelect, zip: string): Promise<TrainingSelect> {
    // Create a new model for this training
    const date = new Date().getTime();
    const id = user.id.replace("|", "_");

    const name = `training_${date}_${id}`;
    const fileName = `${name}.zip`;
    const model = await this.model(name);

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
      .insert(Trainings)
      .values({
        id: response.id,
        name: "test",
        userId: user.id,
        zipUrl: upload.url.publicUrl,
        model: model,
        training: response,
      })
      .returning();
    console.info("Saved training to database:", training.id);
    console.debug(training);

    return training;
  }

  async list(user: UserSelect): Promise<TrainingSelect[]> {
    console.info("Fetching trainings for user:", user.id);
    const trainings = await this.db
      .select()
      .from(Trainings)
      .where(eq(Trainings.userId, user.id))
      .orderBy(desc(Trainings.createdAt));
    const log = `Fetched ${trainings.length} trainings for user: ${user.id}`;
    console.info(log);
    console.debug(trainings);

    return trainings;
  }

  async fetch(id: string): Promise<TrainingSelect> {
    console.info("Fetching training:", id);
    const [training] = await this.db
      .select()
      .from(Trainings)
      .where(eq(Trainings.id, id));

    if (!training) {
      console.warn(`Training not found: ${id}`);
      throw new Error(`Training not found: ${id}`);
    }

    const log = `Fetched training: ${training.id}`;
    console.info(log);
    console.debug(training);

    return training;
  }

  async update(training: Training): Promise<TrainingSelect> {
    console.info("Updating training:", training.id);
    const weights_url = training.output?.weights;
    const [updated] = await this.db
      .update(Trainings)
      .set({ training, weights_url })
      .where(eq(Trainings.id, training.id))
      .returning();
    console.info("Updated training:", updated.id);
    console.debug(updated);
    return updated;
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
