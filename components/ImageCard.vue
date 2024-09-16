<template>
	<Card>
		<template #content>
			<p> Created at {{ image.data.created_at }} </p>
			<NuxtImg :src="image.data.output?.at(0)" />
		</template>
	</Card>
</template>

<script lang="ts" setup>
import type { CreationSelect } from "~/server/utils/db/schema";
const props = defineProps<{ image: CreationSelect }>();
const image = toRef(props, "image");
</script>
