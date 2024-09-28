<template>
  <TrainForm @submit="submit" />
</template>

<script setup lang="ts">
import type { TrainFormValues } from "./TrainForm.vue";

const submit = async (data: TrainFormValues) => {
	console.log(data);

	const response = await $fetch("/api/training", {
		method: "POST",
		body: data,
	});

	console.log(response);
};
</script>
