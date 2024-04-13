<template>
  <div>
    <Card>
      <template #title>Unauthenticated API call</template>
      <template #content>
        <pre> {{ dataUnauth.data }}</pre>
      </template>
      <template #footer>
        <Button @click="dataUnauth.refresh">Fetch</Button>
      </template>
    </Card>

    <Card>
      <template #title>Authenticated API call</template>
      <template #content>
        <pre v-if="dataAuth.status.value === 'pending'"> Loading </pre>
        <pre v-if="dataAuth.status.value === 'success'"> {{ dataAuth.data }}</pre>
        <pre v-if="dataAuth.status.value === 'error'"> {{ dataAuth.error }}</pre>
      </template>
      <template #footer>
        <Button @click="dataAuth.refresh">Fetch</Button>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ auth: false });
const dataAuth = await useFetch("/api/me")
const dataUnauth = await useFetch("/api")
</script>
