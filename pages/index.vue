<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">Welcome to Our AI Photo Generation</h1>
    <p class="mt-4 text-lg">Create stunning images using AI technology.</p>
    <router-link to="/login" class="mt-6 btn btn-primary">Get Started</router-link>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false // This allows public access to the page
});
</script>