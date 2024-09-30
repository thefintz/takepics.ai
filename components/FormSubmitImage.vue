<template>
  <form @submit.prevent="() => execute()">
    <!-- First Dropdown: Specify optionValue=name -->
    <Dropdown
      class="min-w-60 max-w-full"
      v-model="selectedCategory"
      :options="categories"
      optionLabel=name
      optionValue=name
      placeholder="Select category"
      @change="onCategoryChange"
    />
    
    <!-- Second Dropdown: Remains mostly unchanged -->
    <Dropdown
      class="min-w-60 max-w-full ml-4"
      v-model="selectedPrompt"
      :options="filteredPrompts"
      optionLabel=name
      optionValue=prompt
      placeholder="Select style"
      :disabled="!selectedCategory"
    />

		<!-- Model (name) selector -->
		<Select v-model="model" :options="models ?? []" optionLabel="id" optionValue="id" placeholder="Select Model" class="min-w-60 max-w-full ml-4" />
    <Button class="ml-4" label="Create Images" type="submit"></Button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { CreationSelect } from "~/server/utils/db/schema";

// State Variables
const selectedCategory = ref<string | null>(null);
const selectedPrompt = ref<string>("");

import promptOptions from '~/assets/promptOptions.json';

// Compute unique categories
const categories = computed(() => {
  const uniqueCategories = [...new Set(promptOptions.map(option => option.category))];
  return uniqueCategories.map(category => ({ name: category }));
});

// Update filteredPrompts based on selectedCategory
const filteredPrompts = computed(() => {
  if (selectedCategory.value) {
    return promptOptions.filter(option => option.category === selectedCategory.value);
  }
  return [];
});

// Handle category change
const onCategoryChange = () => {
  selectedPrompt.value = "";
};

// Define Emits
const emits = defineEmits<(e: "response", data: CreationSelect) => void>();

const prompt = ref<string | null>(null);
const model = ref<string | null>(null);

const { data: models } = useFetch("/api/training");
model.value = models.value?.[0]?.id ?? null;

// Post Generation Function
const postGeneration = async () => {
	if (!model.value) return;
	if (!prompt.value) return;

	const data: CreationSelect = await $fetch("/api/inference", {
		method: "POST",
		body: { prompt: prompt.value, model: model.value },
	});

	model.value = null;
	prompt.value = null;

	emits("response", data);

	return data;
};

// Execute Async Data
const { execute } = await useAsyncData(postGeneration, { immediate: false });
</script>