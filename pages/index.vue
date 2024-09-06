<template>
  <div class="flex justify-center gap-4">
    <Card class="min-w-[30%] max-w-[30%]">
      <template #content>
        <pre> {{ data }} </pre>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
// This tells nuxt-auth that this page is public
definePageMeta({ auth: false });
const { data } = await useFetch("/api/users");
</script>
