<template>
	<div class="image-card cursor-pointer" @click="showImage">
		<Card class="w-full">
			<template #content>
				<p class="text-sm text-gray-400"> {{ formattedDate }} </p>
				<NuxtImg v-if="image.url" :src="image.url" class="w-full h-auto object-cover" />
        <div v-else class="w-full h-40 flex flex-col justify-center items-center">
					<ProgressSpinner />
					<p class="mt-2">{{ countdownText }}</p>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{ image: ImageSelect }>();
const image = toRef(props, "image");
const isModalVisible = ref(false);

const countdown = ref(30);
let timer: NodeJS.Timeout | null = null;

const countdownText = computed(() => {
	return `Creating... ${countdown.value}s`;
});

const startCountdown = () => {
	if (image.value.url) return;
	
	countdown.value = 45;
	timer = setInterval(() => {
		if (countdown.value > 0) {
			countdown.value--;
		} else {
			if (timer) clearInterval(timer);
		}
	}, 1000);
};

onMounted(() => {
	startCountdown();
});

onUnmounted(() => {
	if (timer) clearInterval(timer);
});

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
