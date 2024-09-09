<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <FormSubmitImage @response="() => refresh()" />
        <button @click="() => buy()">Buy</button>
      </template>
    </Card>
    <ImageCard v-for="i in data" :key="i.id" :image="i" />
  </div>
</template>

<script lang="ts" setup>
const { data, refresh } = await useFetch("/api/images", {
	default: () => [],
});

const buy = async () => navigateTo("/api/checkout", { external: true });

// const interval = useIntervalFn(() => refresh(), 1_000); // refresh every 5s
// useTimeoutFn(() => interval.pause(), 100_000); // stops refresing after 100s
</script>
