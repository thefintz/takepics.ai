<template>
	<div class="image-card cursor-pointer" @click="showImage">
		<Card class="w-full border-none shadow-none custom-card">
			<template #content>
				<p class="text-sm text-gray-400 pt-2 pb-1 px-2"> {{ formattedDate }} </p>
				<NuxtImg v-if="image.url" :src="image.url" class="w-full h-auto object-cover" />
				<div v-else class="w-full h-40 flex flex-col justify-center items-center">
					<ProgressSpinner />
					<p class="mt-2">{{ countdownText }}</p>
				</div>
			</template>
		</Card>

		<!-- Modal for showing the full-size image -->
		<Dialog v-model:visible="isModalVisible" modal class="p-4 max-w-xl w-full" :dismissable-mask="true">
			<template #header>
				<h2 class="text-lg font-semibold">Image Preview</h2>
				<p class="text-sm text-gray-400 pt-2 pb-1 px-2"> {{ formattedDate }} </p>
			</template>
			<div class="flex justify-center items-center">
				<NuxtImg v-if="image.url" :src="image.url" class="max-w-full h-auto object-cover" />
			</div>
			<template #footer>
				<div class="flex justify-center w-full space-x-4">
					<Button label="Download" class="invisible sm:visible" @click="downloadImage" />
					<Button label="Close" class="" @click="isModalVisible = false" />
				</div>
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

const downloadImage = async () => {
  try {
    const response = await fetch(image.value.url ?? '');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'takepics_img.jpg'); // Specify the filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the element after download
    URL.revokeObjectURL(link.href);  // Release the memory used by the blob
  } catch (error) {
    console.error('Error downloading the image:', error);
  }
};
</script>

<style scoped>
.custom-card {
  --p-card-body-padding: 0;
}
</style>
