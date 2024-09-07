<template>
  <div class="flex justify-center gap-4">
    <Card class="min-w-[30%] max-w-[30%]">
      <template #content>
        <form @submit.prevent="() => execute()">
          <InputText v-model="url" name="url" placeholder="Url..." />
          <InputText v-model="caption" name="url" placeholder="Caption..." />
          <Button label="Generate" type="submit" ></Button>
        </form>
        <pre>{{ generation }}</pre>
        <ul>
          <li v-for="item in images" :key="item.id">
            <pre>{{ item }}</pre>
          </li>
        </ul>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
// This tells nuxt-auth that this page is public
definePageMeta({ auth: false });

const url = ref("");
const caption = ref("");

const postGeneration = async () => {
	return $fetch("/api/replicate/generations", {
		method: "POST",
		body: { url: url.value, caption: caption.value },
	});
};

const { data: generation, execute } = await useAsyncData(postGeneration, {
	immediate: false,
});

const { data: images } = await useFetch("/api/images", {
	default: () => [],
});
</script>
