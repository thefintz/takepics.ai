<template>
  <div class="flex justify-center gap-4">
    <Card class="min-w-[30%] max-w-[30%]">
      <template #title>Unauthenticated API call</template>
      <template #content>
        <pre> {{ dataUnauth }} </pre>
      </template>
      <template #footer>
        <Button @click="fetchUnauthenticated">Fetch</Button>
      </template>
    </Card>
    
    <Card class="min-w-[30%] max-w-[30%]">
      <template #title>Authenticated API call</template>
      <template #content>
        <pre class="text-nowrap overflow-clip"> {{ dataAuth }} </pre>
      </template>
      <template #footer>
        <Button @click="fetchAuthenticated">Fetch</Button>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { Index, User } from "~/types";

definePageMeta({ auth: false });

const dataAuth = ref<User | null>(null);
const dataUnauth = ref<Index | null>(null);

const fetchAuthenticated = async () => {
  dataAuth.value = await $fetch("/api/me");
};

const fetchUnauthenticated = async () => {
  dataUnauth.value = await $fetch("/api");
};
</script>
