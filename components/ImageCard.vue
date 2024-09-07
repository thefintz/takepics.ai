<template>
	<Card>
		<template #content>
			<NuxtImg :src="image.url" />
			<p> Created at {{ image.creation.data.created_at }} </p>
			<NuxtImg :src="image.creation.data.output?.at(0)" />
		</template>
	</Card>
</template>

<script lang="ts" setup>
import type { ImageWithCreation } from "~/server/utils/db";
const { image } = defineProps<{ image: ImageWithCreation }>();
</script>
