<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-center items-center">
      <span v-for="i in 5" :key="i" class="text-yellow-400">
        <i :class="i <= testimonial.rating ? 'pi pi-star-fill' : 'pi pi-star'"></i>
      </span>
    </div>
    <p class="text-lg text-gray-200 font-semibold italic mb-4 text-center">"{{ testimonial.quote }}"</p>
    <div class="flex items-center">
      <img :src="testimonial.avatar" :alt="testimonial.name" class="w-16 h-16 rounded-full mr-4">
      <div>
        <p class="font-medium text-gray-200">{{ testimonial.name }}</p>
        <p class="text-sm text-gray-400">{{ testimonial.company }}</p>
        <div v-if="testimonial.verified" class="flex items-center mt-2 text-green-600">
          <i class="pi pi-check-circle mr-1"></i>
          <span class="text-sm">Verified Purchase</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  testimonial: {
    type: Object,
    required: true
  }
});
</script>