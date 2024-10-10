<template>
  <div class="bg-zinc-800 text-gray-100 p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">How to Create Your Model and Generate Images</h2>

    <p class="mb-2">
      To create photos of a person, you need to create/train a model for that person.
    </p>
    <p class="mb-2 font-semibold">
      It's very easy, just 2 simple steps.
    </p>
    <p class="mb-2 text-sm text-gray-400">
      Note: this training process only has to be done once per person.
    </p>

    <!-- Step 1 -->
    <div class="my-6">
      <h3 class="text-3xl font-semibold mb-2">Step 1: Create Your Model</h3>
      <p class="mb-2">
        Select the gender and eye color, and give the model a name (so you can identify it later).
      </p>
      <p class="mb-2">
        Upload 12-20 images of the person you want to create a model for.
      </p>
      <p class="underline mb-2"> Image tips for better results:</p>
        <p class="mb-2 ml-4">
          Include photos with different angles, clothing, facial expressions, and zoom levels.
        </p>
        <p class="ml-4">
          Also try to avoid including images with more than one person, hats, sunglasses, covered faces, etc.
        </p>
        <p class="mb-2 ml-4">A few is ok, but many will make the AI think that is a feature of the person and not the specific image.</p>
      </div>

    <!-- Step 2 -->
    <div class="">
      <h3 class="text-2xl font-semibold mb-2">Step 2: Start Training</h3>
      <p class="mb-2"> When ready, click the "Train" button. </p>
      <p class="mb-2">
        The AI will take about 1 hour to process and make the model available for you to create images.
        You can leave this page/website and return later.
      </p>      
      <p class="mb-2">
        <span class="underline font-medium"> Done!</span> After training, go to the "Create Images" page, select your model and create your images.
      </p>
      <p class="mb-2 text-sm text-gray-400">
        Note: The model will only show up in the "Create Images" page if it has finished training.
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
</script>
