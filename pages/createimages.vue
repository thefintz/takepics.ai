<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <div class="flex items-center gap-4 mb-4">
          <span>Image credits: {{ session?.user?.imageCredits }}</span>
          <span class="cursor-pointer text-sm text-gray-300 hover:underline ml-auto" @click="showLimitationsToast">limitations</span>
        </div>
        <FormSubmitImage @response="() => refresh()" />
      </template>
    </Card>
    <Paginator
      :rows="rows"
      :totalRecords="data.length"
      :first="first"
      @page="onPageChange"
      class="flex justify-center"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    />
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 px-2">
      <ImageCard v-for="i in paginatedImages" :key="i.id" :image="i" />
    </div>
  </div>
  <Toast />
</template>

<script lang="ts" setup>
const { data: session } = useAuth();

const { data, refresh } = await useFetch("/api/inference", {
	default: () => [],
});
// console.log(data.value);

const interval = useIntervalFn(() => refresh(), 5_000); // refresh every 5s
useTimeoutFn(() => interval.pause(), 3_600_000); // stops refreshing after 1h
const first = ref(0);
const rows = ref(16);
const toast = useToast();

const showLimitationsToast = () => {
  toast.add({
    severity: 'warn',
    summary: 'AI Limitations',
    detail: 'Images containing blood, children, drug use, or nudity will not be created due to AI limitations.',
    life: 5000
  });
};

const paginatedImages = computed(() => {
  return data.value?.slice(first.value, first.value + rows.value) || [];
});

const onPageChange = (event: any) => {
  first.value = event.first;
  rows.value = event.rows;
};

</script>

<style scoped>
/* Optional: Scoped styles if you need any additional specific styling */
</style>
