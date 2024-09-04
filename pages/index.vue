<template>
  <div class="flex justify-center gap-4">
    <Card class="min-w-[30%] max-w-[30%]">
      <template #title> Unauthenticated API call </template>

      <template #content>
        <pre> {{ publicData }} </pre>
      </template>

      <template #footer>
        <Button @click="() => publicRefresh()">Fetch</Button>
      </template>
    </Card>
    
    <Card class="min-w-[30%] max-w-[30%]">
      <template #title> Authenticated API call </template>

      <template #content>
        <pre class="text-nowrap overflow-clip"> {{ privateData }} </pre>
      </template>

      <template #footer>
        <Button :disabled="status === 'unauthenticated'" @click="() => privateRefresh()">Fetch</Button>
      </template>
    </Card>

  </div>
</template>

<script lang="ts" setup>
import type { User } from "next-auth";
import type { Index } from "~/server/api/index.get";

// This tells nuxt-auth that this page is public
definePageMeta({ auth: false });

const { status } = useAuth();

const [
	{ data: privateData, refresh: privateRefresh },
	{ data: publicData, refresh: publicRefresh },
] = await Promise.all([
	useFetch<User>("/api/me", { server: false, immediate: false }),
	useFetch<Index>("/api", { server: false, immediate: false }),
]);
</script>
