<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <div class="flex items-center gap-4 mb-4">
          <span>Image credits: {{ session?.user?.imageCredits }}</span>
          <button @click="() => buy()" class="text-sky-400 text-sm">Buy Credits (1 credit = 1 image)</button>
          <span class="cursor-pointer text-sm text-gray-300 hover:underline ml-auto" @click="showLimitationsToast">limitations</span>
        </div>
        <FormSubmitImage @response="() => refresh()" />
      </template>
    </Card>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 px-2">
      <ImageCard v-for="i in data" :key="i.id" :image="i" />
    </div>
  </div>
  <Toast />
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

const toast = useToast();

const showLimitationsToast = () => {
  toast.add({
    severity: 'warn',
    summary: 'AI Limitations',
    detail: 'Images containing blood, children, drug use, or nudity will not be created due to AI limitations.',
    life: 5000
  });
};

</script>

<style scoped>
/* Optional: Scoped styles if you need any additional specific styling */
</style>
