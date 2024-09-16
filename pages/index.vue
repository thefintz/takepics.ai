<template>
  <div class="flex flex-col justify-center gap-4">
    <Card>
      <template #content>
        <p>Creations remaining: {{ session?.user?.credits }}</p>
        <FormSubmitImage @response="() => refresh()" />
        <button @click="() => buy()">Buy</button>
      </template>
    </Card>
    <ImageCard v-for="i in data" :key="i.id" :image="i" />
  </div>
</template>

<script lang="ts" setup>
const { data: session } = useAuth();

const { data, refresh } = await useFetch("/api/inference", { default: () => [] });
const buy = async () => navigateTo("/api/checkout", { external: true });

const interval = useIntervalFn(() => refresh(), 5_000); // refresh every 5s
useTimeoutFn(() => interval.pause(), 100_000); // stops refresing after 100s
</script>
