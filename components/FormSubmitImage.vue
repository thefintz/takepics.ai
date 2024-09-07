<template>
	<div>
		<form @submit.prevent="() => execute()">
			<InputText v-model="url" name="url" placeholder="Url..." />
			<InputText v-model="caption" name="url" placeholder="Caption..." />
			<Button label="Generate" type="submit" ></Button>
		</form>
	</div>
</template>

<script lang="ts" setup>
import type { ImageWithCreation } from "~/server/utils/db";

const url = ref("");
const caption = ref("");

const emits = defineEmits({
	/**
	 * Emmited when the image response is ready
	 */
	response: (data: ImageWithCreation) => {
		if (data) return false;
		return true;
	},
});

const postGeneration = async () => {
	if (!url.value) return;
	if (!caption.value) return;

	const data: ImageWithCreation = await $fetch("/api/images", {
		method: "POST",
		body: { url: url.value, caption: caption.value },
	});

	url.value = "";
	caption.value = "";
	emits("response", data);

	return data;
};

const { execute } = await useAsyncData(postGeneration, { immediate: false });
</script>
