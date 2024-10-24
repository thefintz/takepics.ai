<template>
  <div class="bg-black rounded-lg shadow-lg overflow-hidden flex flex-col w-60 sm:w-72 md:w-full mx-auto" :class="{ 'ring-8 ring-yellow-500': highlighted }">
    <div class="relative md:aspect-[2/3] aspect-[5/6]  ">
      <NuxtImg :src="imageSrc" :alt="title" class="w-full h-full object-cover" />
    </div>
    <div class="py-2 px-3 bg-black text-white">
      <h3 class="text-xl font-bold mb-2 md:mb-4">{{ title }}</h3>
      <ul>
        <li v-for="(value, key) in features" :key="key" class="flex items-center mb-0 md:mb-2">
          <i :class="[value ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500', 'mr-2']"></i>
          <span>{{ formatFeatureName(key) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ComparisonCardProps {
  title: string;
  imageSrc: string;
  features: Record<string, boolean>;
  highlighted?: boolean;
}

const props = defineProps<ComparisonCardProps>();

const formatFeatureName = (key: string): string => {
  return key
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>