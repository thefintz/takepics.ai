import { H3Event } from 'h3';
import { createTrainingService } from '~/server/utils/services/training';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  // Validate the webhook payload (implement proper validation)
  if (!body || !body.id || !body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid webhook payload',
    });
  }

  const trainingService = createTrainingService(db);

  // Update the training status in the database
  await trainingService.updateTrainingStatus(body.id, body.status, body.output?.model);

  return { message: 'Webhook processed successfully' };
});
