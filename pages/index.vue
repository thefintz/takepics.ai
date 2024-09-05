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
import type { User } from "next-auth";
import type { Index } from "~/server/api/index.get";

// This tells nuxt-auth that this page is public
definePageMeta({ auth: false });

const data = ref({});
// const { data } = await useFetch("/api/ai/create", {
// 	body: {
// 		prompt: "a wintery blurry pinewood forest",
// 	},
// });
</script>
