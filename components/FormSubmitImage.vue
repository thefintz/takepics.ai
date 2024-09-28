<template>
  <form @submit.prevent="() => execute()">
		<InputText v-model="prompt" placeholder="Enter a prompt" />
		<Select v-model="model" :options="models ?? []" optionLabel="id" optionValue="id" placeholder="Select Model" />
    <Button class="ml-4" label="Create Images" type="submit"></Button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { CreationSelect } from "~/server/utils/db/schema";

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