<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <FormSubmitImage @response="() => refresh()" />
      </template>
    </Card>
    <ImageCard v-for="i in data" :key="i.id" :image="i" />
  </div>
</template>

<script lang="ts" setup>
const { data, refresh } = await useFetch("/api/images", {
	default: () => [],
});

useIntervalFn(() => refresh(), 5_000);
</script>
