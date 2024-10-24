<template>
  <Form @submit.prevent="submit" class="flex flex-col items-center max-w-xl mx-auto p-6 rounded-lg">
    <div class="w-full">
      <p class="text-lg font-bold mb-2 text-left">Select gender</p>
      <Select
        class="w-full"
        v-model="selectedGender"
        :options="OPTIONS_GENDER"
        optionLabel="label"
        optionValue="value"
        placeholder="Select Gender"
      />
    </div>

    <div class="mt-6 w-full">
      <p class="text-lg font-bold mb-2 text-left">Select eye color</p>
      <Select
        class="w-full"
        v-model="selectedEyeColor"
        :options="OPTIONS_EYE_COLOR"
        optionLabel="label"
        optionValue="value"
        placeholder="Select Eye Color"
      />
    </div>

    <div class="mt-6 w-full">
      <p class="text-lg font-bold mb-2 text-left">Model name</p>
      <InputText
        class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="modelName"
        placeholder="Enter a model name"
      />
    </div>

    <div class="mt-6 w-full">
      <p class="text-lg font-bold mb-2 text-left">Upload Images</p>
      <FileUpload
        class="w-full"
        mode="advanced"
        :multiple="true"
        accept="image/*"
        :maxFileSize="10000000"
        :auto="true"
        chooseLabel="Select Images"
        :showUploadButton="false"
        :showCancelButton="false"
        @select="onFileSelected"
        @removeUploadedFile="onFileRemoved"
      />
    </div>

    <Button
      class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300 disabled:bg-gray-300"
      label="Train"
      @click="showConfirmation"
      :disabled="!isFormValid"
    />

    <div class="mt-6 text-center">
      <p class="text-md font-medium">Training Credits: {{ session?.user?.trainingCredits }}</p>
    </div>

    <!-- Updated Dialog component using Tailwind classes -->
    <Dialog v-model:visible="confirmationVisible" modal header="Confirm Start Training Model?" class="w-11/12 max-w-lg">
      <p class="mb-4">
        Each training (new model) costs 1 training credit.
      </p>
      <p class="mb-4">
        You will not be able to add more images later (only by creating another model and consuming another credit), so make sure you have included all the images you want.
      </p>
      <p class="mb-4">
        Available Training Credits: {{ session?.user?.trainingCredits }}
      </p>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="confirmationVisible = false" class="p-button-text" />
        <Button label="Confirm" icon="pi pi-check" @click="confirmAndSubmit" autofocus />
      </template>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent, FileUploadRemoveEvent } from "primevue/fileupload";
import { computed, ref } from "vue";
const { data: session } = useAuth();

interface File {
  objectURL: string;
  name: string;
}

export type TrainFormValues = {
  zip: string;
  trainingType: "person" | "object";
  gender: "male" | "female" | "other";
  eyeColor: "brown" | "blue" | "green" | "hazel" | "black";
};

const OPTIONS_TRAINING_TYPE = [
  { label: "Person", value: "person" },
  { label: "Object", value: "object" },
];

const OPTIONS_GENDER = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const OPTIONS_EYE_COLOR = [
  { label: "Brown", value: "brown" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Hazel", value: "hazel" },
  { label: "Black", value: "black" },
];

type Training = "person" | "object";
type Gender = "male" | "female" | "other";
type EyeColor = "brown" | "blue" | "green" | "hazel" | "black";

const selectedGender = ref<Gender | null>(null);
const selectedEyeColor = ref<EyeColor | null>(null);
const selectedTrainingType = ref<Training>("person");

const emits = defineEmits<(e: "submit", data: TrainFormValues) => void>();

const files = ref<File[]>([]);
const onFileSelected = (event: FileUploadSelectEvent) => {
  files.value = [...files.value, ...event.files];
};

const onFileRemoved = (event: FileUploadRemoveEvent) => {
  files.value = files.value.filter(file => file.name !== event.file.name);
};

const modelName = ref<string>('');

// Add this computed property to check form validity
const isFormValid = computed(() => {
  return (
    selectedTrainingType.value !== null &&
    selectedGender.value !== null &&
    selectedEyeColor.value !== null &&
    files.value.length > 0 &&
    modelName.value.trim() !== ''
  );
});

const confirmationVisible = ref(false);

const submit = async () => {
  const zipped = await useZippedFiles(files.value);

  const values = {
    zip: zipped,
    gender: selectedGender.value as Gender,
    eyeColor: selectedEyeColor.value as EyeColor,
    trainingType: selectedTrainingType.value as Training,
    customName: modelName.value || `Model_${new Date().toISOString().split('T')[0]}`, // User input or Model_YYYY-MM-DD
  };

  emits("submit", values);
};

const showConfirmation = () => {
  confirmationVisible.value = true;
};

const confirmAndSubmit = async () => {
  await submit();
  confirmationVisible.value = false;
};
</script>
