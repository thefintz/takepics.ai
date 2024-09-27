<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Train Your AI Model</h1>
    <p> Here you will train an AI model to recognize a person or object.</p>
    <p> After training, you can create images for that person/object in many scenarios. </p>
    <div class="my-6">
      <h2 class="text-xl font-semibold mb-2">Training Type</h2>
      <div class="flex">
        <div v-for="option in trainingTypeOptions" :key="option.value" class="mr-4">
          <RadioButton
            :inputId="option.value"
            name="trainingType"
            :value="option.value"
            v-model="selectedTrainingType"
          />
          <label :for="option.value" class="ml-2">{{ option.label }}</label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Upload Images</h2>
      <p class="mb-2">Upload 10 to 20 images of the {{ selectedTrainingType }}.</p>
      <p>For best results, try to include:</p>
      <ul class="list-disc ml-8 mb-4">
        <li>Different angles.</li>
        <li>Different lighting conditions.</li>
        <li>Some close-ups, some farther away.</li>
        <li v-if="selectedTrainingType === 'person'">Various expressions and clothing.</li>
        <li v-if="selectedTrainingType === 'person'">Avoid masks, beanies, hats, etc</li>
      </ul>
      <FileUpload
        mode="advanced"
        :multiple="true"
        accept="image/*"
        :maxFileSize="10000000"
        @select="onSelect"
        :auto="true"
        chooseLabel="Select Images"
        :showUploadButton="false"
        :showCancelButton="false"
      />
      <small class="text-gray-500">{{ uploadedImages.length }} images uploaded</small>
    </div>

    <div v-if="selectedTrainingType === 'person'" class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Gender</h2>
      <div class="flex">
        <div v-for="option in genderOptions" :key="option.value" class="mr-4">
          <RadioButton
            :inputId="option.value"
            name="gender"
            :value="option.value"
            v-model="selectedGender"
          />
          <label :for="option.value" class="ml-2">{{ option.label }}</label>
        </div>
      </div>
    </div>

    <div v-if="selectedTrainingType === 'person'" class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Eye Color</h2>
      <Dropdown
        v-model="selectedEyeColor"
        :options="eyeColorOptions"
        optionLabel="label"
        placeholder="Select Eye Color"
        class="w-full md:w-14rem"
      />
    </div>

    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Name the {{ selectedTrainingType }}</h2>
      <InputText v-model="trainingName" placeholder="Enter a name" class="w-full" />
    </div>

    <Button
      label="Start Training"
      @click="startTraining"
      :disabled="!isFormValid"
      class="p-button-primary"
    />

    <div v-if="trainingStarted" class="mt-6 p-4 bg-blue-100 rounded">
      <p>Training has started! The process takes approximately 1 hour. You can close this page and come back later to check the results.</p>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useTrainingService } from '~/composables/useTrainingService';

const toast = useToast();
const trainingService = useTrainingService();

const uploadedImages = ref([]);
const selectedGender = ref('');
const selectedEyeColor = ref(null);
const trainingStarted = ref(false);
const selectedTrainingType = ref('person');
const trainingName = ref('');

const trainingTypeOptions = [
  { label: 'Person', value: 'person' },
  { label: 'Object', value: 'object' },
];

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const eyeColorOptions = [
  { label: 'Brown', value: 'brown' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Hazel', value: 'hazel' },
  { label: 'Black', value: 'black' },
];

const isFormValid = computed(() => {
  const baseValidation = uploadedImages.value.length >= 10 &&
                         uploadedImages.value.length <= 20 &&
                         trainingName.value.trim() !== '';
  
  if (selectedTrainingType.value === 'person') {
    return baseValidation && selectedGender.value && selectedEyeColor.value;
  }
  
  return baseValidation;
});

const onSelect = (event) => {
  uploadedImages.value = [...uploadedImages.value, ...event.files];
  toast.add({ severity: 'success', summary: 'Success', detail: `${event.files.length} file(s) selected successfully`, life: 3000 });
};

const startTraining = async () => {
  if (!isFormValid.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    return;
  }

  try {
    const trainingData = {
      images: uploadedImages.value,
      training_type: selectedTrainingType.value,
      name: trainingName.value,
      gender: selectedTrainingType.value === 'person' ? selectedGender.value : null,
      eye_color: selectedTrainingType.value === 'person' ? selectedEyeColor.value.value : null,
    };

    const response = await trainingService.startTraining(trainingData);

    if (response.ok) {
      trainingStarted.value = true;
      toast.add({ severity: 'success', summary: 'Success', detail: 'Training started successfully', life: 3000 });
    } else {
      throw new Error('Failed to start training');
    }
  } catch (error) {
    console.error('Error starting training:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to start training', life: 3000 });
  }
};
</script>
