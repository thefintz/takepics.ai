<template>
  <Card>
    <!-- Header: Profile Picture -->
    <template #header>
      <div class="flex items-center gap-4 p-8">
<!--        <Avatar size="xlarge">-->
<!--          <NuxtImg alt="Profile Picture" :src="data?.image ?? placeholderImage" />-->
<!--        </Avatar>-->
        <div>
          <h2 class="text-xl font-semibold">{{ data?.email }}</h2>
          <p v-if="data?.createdAt" class="text-gray-400">Created: {{ formatDate(data.createdAt) }}</p>
        </div>
      </div>
    </template>

    <!-- Content: Detailed Profile Information -->
    <template #content>
      <div class="">
        <div class="mb-6">
          <h4 class="mb-2 text-xl font-semibold text-gray-100">Subscription</h4>
          <p v-if="data?.name" class="text-gray-400"><strong>Training credits:</strong> {{ data?.trainingCredits }}</p>
          <p v-if="data?.name" class="text-gray-400"><strong>Image credits:</strong> {{ data?.imageCredits }}</p>
          <p class="text-gray-400">
            <a href="https://billing.stripe.com/p/login/test_cN2dS8c210D6aDC144" class="cursor-pointer text-blue-500 underline">
              View Current Plan</a>
          </p>
        </div>

        <!-- Additional Information for Development Purpose -->
        <!-- <div v-if="isDevMode" class="bg-gray-100 p-4 rounded-lg text-gray-600">
          <h4 class="mb-2 text-lg font-semibold">Debug Data</h4>
          <pre>{{ data }}</pre>
        </div> -->
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const { data } = await useFetch('/api/me');
const placeholderImage = 'https://via.placeholder.com/150';
let isDevMode = ref(process.env.NODE_ENV === 'development');

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>

<style scoped>
</style>
