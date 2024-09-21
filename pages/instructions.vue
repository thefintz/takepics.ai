<template>
  <Card>
    <template #header>
      <div class="mt-4">
        <span class="text-4xl pl-5 font-bold">Instructions and FAQ</span>
      </div>
    </template>

    <template #title>
      <span class="text-2xl">How to create my images?</span>
    </template>

    <template #content>
      <p>Yes! Two simple steps:</p>
      <ol>
        <li>Create your model (12-20 images, variety in angles, clothes, and closeness). Click "train"—it will take about 1 hour for the AI to train. You can leave this page and come back later.</li>
        <li>Create images by selecting the category and styles.</li>
      </ol>
    </template>
  </Card>

  <Card>
    <template #title>
      <span class="text-2xl">What are the limitations and rules?</span>
    </template>

    <template #content>
      <p>Yes, there are a few limitations: no smoking, no nudes, no drugs, and no blood. These are the AI limitations, so not only our rules.</p>
    </template>
  </Card>
</template>

<script lang="ts" setup>
</script>
