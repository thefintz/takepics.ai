<template>
  <form @submit.prevent="submit">

      <div class="mt-4">
        <p class="text-lg font-bold my-1 ml-1">Select gender</p>
        <Select
          v-model="selectedGender"
          :options="OPTIONS_GENDER"
          optionLabel="label"
          optionValue="value"
          placeholder="Gender"
        />
      </div>

      <div class="my-4">
        <p class="text-lg font-bold my-1 ml-1">Select eye color</p>
        <Select
          v-model="selectedEyeColor"
          :options="OPTIONS_EYE_COLOR"
          optionLabel="label"
          optionValue="value"
          placeholder="Eye Color"
        />
      </div>

      <div class="max-w-xl">
        <FileUpload
          mode="advanced"
          :multiple="true"
          accept="image/*"
          :maxFileSize="10000000"
          :auto="true"
          chooseLabel="Select Images"
          :showUploadButton="false"
          :showCancelButton="false"
          @select="onFileSelected"
        />
      </div>

      <div class="mt-4">
        <p class="text-lg font-bold my-1 ml-1">Choose model name</p>
        <InputText v-model="modelName" placeholder="Enter Model Name" />
      </div>

    <Button class="mt-4" label="Train" @click="submit" :disabled="!isFormValid" />
  </form>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from "primevue/fileupload";
import { computed, ref } from "vue";

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
	files.value = [...event.files];
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

const submit = async () => {
	const zipped = await useZippedFiles(files.value);

	const values = {
		zip: zipped,
		gender: selectedGender.value as Gender,
		eyeColor: selectedEyeColor.value as EyeColor,
		trainingType: selectedTrainingType.value as Training,
    name: modelName.value || `Model_${new Date().toISOString().split('T')[0]}`,    // User input or Model_YYYY-MM-DD
	};

	emits("submit", values);
};
</script>
