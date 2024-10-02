<template>
	<div class="image-card cursor-pointer" @click="showImage">
		<Card class="w-full">
			<template #content>
				<p class="text-sm text-gray-400"> {{ formattedDate }} </p>
				<NuxtImg v-if="image.url" :src="image.url" class="w-full h-auto object-cover" />
        <div v-else class="w-full h-auto flex justify-center items-center">
					<img src="https://media.tenor.com/hQz0Kl373E8AAAAi/loading-waiting.gif" alt="Loading" class="object-cover">
				</div>
			</template>
		</Card>

		<!-- Modal for showing the full-size image -->
		<Dialog v-model:visible="isModalVisible" modal class="p-4 max-w-3xl w-full" :dismissable-mask="true">
			<template #header>
				<h2 class="text-lg font-semibold">Image Preview</h2>
			</template>
			<div class="flex justify-center items-center">
				<NuxtImg v-if="image.url" :src="image.url" class="max-w-full h-auto object-cover" />
			</div>
			<template #footer>
				<Button label="Close" class="mt-4" @click="isModalVisible = false" />
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts" setup>

const props = defineProps<{ image: ImageSelect }>();
const image = toRef(props, "image");
const isModalVisible = ref(false);

const showImage = () => {
	isModalVisible.value = true;
};

// Format the date to "day (number) month (text), year (number) HH:MM"
const formattedDate = computed(() => {
	const date = new Date(image.value.data.created_at);
	const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
	const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

	const formattedDate = date.toLocaleDateString(undefined, dateOptions);
	const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

	return `${formattedDate} ${formattedTime}`;
});
</script>

<style scoped>
/* Optional: Scoped styles if you need any additional specific styling */
</style>
