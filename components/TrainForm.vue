<template>
  <form @submit.prevent="submit">
    <div v-for="option in OPTIONS_TRAINING_TYPE" :key="option.value">
      <RadioButton
        :inputId="option.value"
        name="trainingType"
        :value="option.value"
        v-model="selectedTrainingType"
      />
      <label :for="option.value" class="ml-2">{{ option.label }}</label>
    </div>

      <div class="mt-4">
        <Select
          v-model="selectedGender"
          :options="OPTIONS_GENDER"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Gender"
        />
      </div>

      <div class="mt-4">
        <Select
          v-model="selectedEyeColor"
          :options="OPTIONS_EYE_COLOR"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Eye Color"
        />
      </div>

      <FileUpload
        mode="advanced"
        :multiple="true"
        accept="image/*"
        :maxFileSize="10000000"
        chooseLabel="Select Images"
        :showUploadButton="true"
        @select="onFileSelected"
      />
    <Button label="Train" @click="submit" />
  </form>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from "primevue/fileupload";
import { ref } from "vue";

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
const selectedTrainingType = ref<Training | null>(null);

const emits = defineEmits<(e: "submit", data: TrainFormValues) => void>();

const files = ref<File[]>([]);
const onFileSelected = (event: FileUploadSelectEvent) => {
	files.value = [...event.files];
};

const submit = async () => {
	const zipped = await useZippedFiles(files.value);

	const values = {
		zip: zipped,
		gender: selectedGender.value as Gender,
		eyeColor: selectedEyeColor.value as EyeColor,
		trainingType: selectedTrainingType.value as Training,
	};

	emits("submit", values);
};
</script>
