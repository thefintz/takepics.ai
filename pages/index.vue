<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <div class="flex items-center gap-4 mb-4">
          <span>Credits: {{ session?.user?.credits }}</span>
          <button @click="() => buy()" class="text-sky-400 text-sm">Buy Credits (1 credit = 1 image)</button>
        </div>
        <FormSubmitImage @response="() => refresh()" />
      </template>
    </Card>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ImageCard v-for="i in data" :key="i.id" :image="i" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: session } = useAuth();

const { data, refresh } = await useFetch("/api/inference", { default: () => [] });
const buy = async () => navigateTo("/api/checkout", { external: true });

const interval = useIntervalFn(() => refresh(), 5_000); // refresh every 5s
useTimeoutFn(() => interval.pause(), 100_000); // stops refreshing after 100s
</script>

<style scoped>
/* Optional: Scoped styles if you need any additional specific styling */
</style>
