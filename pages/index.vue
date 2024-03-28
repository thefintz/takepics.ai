<template>
  <div>
    <Card>
      <template #title>Unauthenticated API call</template>
      <template #content>
        <pre> {{ dataUnauth }}</pre>
      </template>
      <template #footer>
        <Button @click="unauthenticatedFetch">Fetch</Button>
      </template>
    </Card>

    <Card>
      <template #title>Authenticated API call</template>
      <template #content>
        <pre> {{ dataAuth }}</pre>
      </template>
      <template #footer>
        <Button @click="authenticatedFetch">Fetch</Button>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ auth: false });

const dataUnauth = ref<any>("no data");
const dataAuth = ref<any>("no data");

const unauthenticatedFetch = async () => {
  const { data } = await useFetch("/api");
  dataUnauth.value = data.value;
};

const authenticatedFetch = async () => {
  const { data, error } = await useFetch("/api/me");
  if (error.value) {
    dataAuth.value = error.value;
    return;
  }
  dataAuth.value = data.value;
};
</script>
