<template>
  <Card>
    <template #header>
      <NuxtImg alt="profile picture" :src="data.image" />
    </template>

    <template #title> {{ data.name }} </template>

    <template #content>
      <pre> {{ data }} </pre>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/me");
</script>
