<template></template>

<script setup lang="ts">
/**
 * This component is only used to identify the user in Posthog and it does not
 * render any HTML
 */
const { data, status } = useAuth();
const { $clientPosthog } = useNuxtApp();

onMounted(() => {
  if (status.value !== "authenticated") return;
  if (!data.value?.user?.email) return;
  $clientPosthog?.identify(data.value.user.email, data.value.user);
});
</script>
