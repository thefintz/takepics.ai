<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <div class="flex items-center gap-4 mb-4">
          <span>Image credits: {{ session?.user?.imageCredits }}</span>
          <button @click="() => buy()" class="text-sky-400 text-sm">Buy Credits (1 credit = 1 image)</button>
        </div>
        <FormSubmitImage @response="() => refresh()" />
      </template>
    </Card>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 px-2">
      <ImageCard v-for="i in data" :key="i.id" :image="i" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: session } = useAuth();

const { data, refresh } = await useFetch("/api/inference", {
	default: () => [],
});
const buy = async () => navigateTo("/api/checkout", { external: true });
console.log(data.value);

const interval = useIntervalFn(() => refresh(), 5_000); // refresh every 5s
useTimeoutFn(() => interval.pause(), 3_600_000); // stops refreshing after 1h
</script>

<style scoped>
/* Optional: Scoped styles if you need any additional specific styling */
</style>
