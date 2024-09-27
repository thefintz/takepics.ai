import { useAsyncData } from '#app';
import type { TrainingInsert } from '~/server/utils/db/schema';

export const useTrainingService = () => {
  const startTraining = async (trainingData: TrainingInsert) => {
    const { data, error } = await useAsyncData('startTraining', () =>
      $fetch('/api/training', {
        method: 'POST',
        body: trainingData,
      })
    );

    if (error.value) {
      throw error.value;
    }

    return data.value;
  };

  return {
    startTraining,
  };
};