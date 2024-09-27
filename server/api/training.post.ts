import { H3Event } from 'h3';
import { createTrainingService } from '~/server/utils/services/training';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const trainingService = createTrainingService(db);

  const training = await trainingService.startTraining(body);

  return training;
});