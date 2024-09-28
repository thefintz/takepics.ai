import { eq } from 'drizzle-orm';
import type { DB } from '../db/client';
import type { TrainingInsert } from '../db/schema';
import { Trainings } from '../db/schema';
import { useServerReplicateClient } from './inference';

export class TrainingService {
  private readonly db: DB;

  constructor(db: DB) {
    this.db = db;
  }

  async createReplicateModel(modelName: string): Promise<string> {
    const replicate = useServerReplicateClient();

    const response = await replicate.models.create(
      // process.env.REPLICATE_USERNAME,
      "model owner", modelName, {
      visibility: "public",
      hardware: "gpu-a100-large" // replicate ignora pra esse modelo (Flux) e direciona pra H100, que ainda não é opção na API.
    });

    return response.name;
  }

  async startTraining(trainingData: TrainingInsert): Promise<TrainingInsert> {
    const replicate = useServerReplicateClient();

    // Create a new model for this training
    const modelName = `training-${Date.now()}`; // name should be unique, maybe random? or useremail_timestamp? or...?
    const newModelName = await this.createReplicateModel(modelName);

    // Start training on Replicate
    const replicateResponse = await replicate.trainings.create(
      "model owner", "model name", "version id",
      {
        destination: `${process.env.REPLICATE_USERNAME}/${newModelName}`,
        input: { training_data: "..." },
        webhook: "https://example.com/replicate-webhook",
      });

    // Save training data to database
    const [training] = await this.db
      .insert(Trainings)
      .values({
        id: replicateResponse.id,
        ...trainingData,
        status: replicateResponse.status,
        // replicateModelName: newModelName,
        // replicateResponse: JSON.stringify(replicateResponse),
        // salvar toda a resposta do replicate no banco
        // Add any other necessary fields
      })
      .returning();

    return training;
  }

  async updateTrainingStatus(id: string, status: string, modelUrl?: string): Promise<void> {
    await this.db
      .update(Trainings)
      .set({ status, modelUrl })
      .where(eq(Trainings.id, id));
  }

  async saveZipToStorage(zipFile: File): Promise<string> {
    // Implement Supabase storage upload logic here
    // Return the URL of the uploaded file
    return 'https://example.com/path/to/uploaded/file.zip';
  }
}

export const createTrainingService = (db: DB): TrainingService => {
  return new TrainingService(db);
};
