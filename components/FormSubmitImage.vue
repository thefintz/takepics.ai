<template>
  <form @submit.prevent="() => execute()">
    <!-- First Select: Replace Dropdown with Select -->
    <Select
      class="min-w-60 ml-4 mb-2 md:mb-0"
      filled
      v-model="selectedCategory"
      :options="categories"
      optionLabel="name"
      optionValue="name"
      placeholder="Select category"
      @change="onCategoryChange"
    />
    
    <!-- Second Select: Replace Dropdown with Select -->
    <Select
      class="min-w-60 max-w-full ml-4 mb-2 md:mb-0"
      filled
      v-model="selectedPrompt"
      :options="getFilteredPrompts()"
      optionLabel="name"
      optionValue="prompt"
      placeholder="Select style"
      :disabled="!selectedCategory"
    />

		<!-- Model (name) selector -->
    <Select v-model="model" :options="models ?? []" optionLabel="customName" optionValue="id" placeholder="Select Model" class="min-w-60 max-w-full ml-4 mb-2 md:mb-0" />
    <Button class="ml-4" label="Create Images" type="submit"></Button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import promptOptions from '~/assets/promptOptions.json';
import type { ImageSelect } from "~/server/utils/db/schema";

// State Variables
const selectedCategory = ref<string | null>(null);
const selectedPrompt = ref<string>("");

// Create categories array
const categories = [...new Set(promptOptions.map(option => option.category))]
  .map(category => ({ name: category }));

// Function to filter prompts based on selected category
const getFilteredPrompts = () => {
  if (selectedCategory.value) {
    return promptOptions.filter(option => option.category === selectedCategory.value);
  }
  return [];
};

// Handle category change
const onCategoryChange = () => {
  selectedPrompt.value = "";
};

// Define Emits
const emits = defineEmits<(e: "response", data: ImageSelect) => void>();

const prompt = ref<string | null>(null);
const model = ref<string | null>(null);

const { data: models } = useFetch("/api/training");
model.value = models.value?.[0]?.id ?? null;

// Post Generation Function
const postGeneration = async () => {
	if (!model.value) return;
	if (!selectedPrompt.value) return;

	const data: ImageSelect = await $fetch("/api/inference", {
		method: "POST",
		body: { prompt: selectedPrompt.value, model: model.value },
	});

	model.value = null;
	prompt.value = null;

	emits("response", data);

	return data;
};

// Execute Async Data
const { execute } = await useAsyncData(postGeneration, { immediate: false });
</script>