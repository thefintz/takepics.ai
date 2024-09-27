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

  async startTraining(trainingData: TrainingInsert): Promise<TrainingInsert> {
    const replicate = useServerReplicateClient();

    // Start training on Replicate (this is a placeholder, implement actual API call)
    const replicateResponse = await replicate.trainings.create(
      "model owner", "model name", "version id",
      {
        destination: "a/b",
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
