<template>
    <div class="md:w-9/12 w-full">
      <div class="bg-zinc-800 text-gray-100 p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">How to Create Your Model and Generate Images</h2>
        
        <!-- PrimeVue Steps -->
        <Steps 
          :model="steps" 
          :active-index="currentStep - 1"
          @step-click="(e) => setStep(e.index + 1)"
          :readonly="false"
          class="mb-8"
        />

        <!-- Step Content -->
        <div>
          <!-- Step 1 Content -->
          <div v-if="currentStep === 1">
            <h3 class="text-xl font-semibold mb-4">Step 1: Create Your Model</h3>
            <div class="ml-4">
              <p>Select the gender and eye color, and give the model a name (so you can identify it later).</p>
              <p>Upload 15-40 images of the person you want to create a model for.</p>
              
              <div class="mt-4">
                <p class="font-medium underline mb-2">Image tips for better results:</p>
                <ul class="list-disc ml-6 space-y-2">
                  <li>Include photos with different angles, clothing, facial expressions, and zoom levels.</li>
                  <li>Try to avoid including images with more than one person, hats, sunglasses, covered faces, etc.</li>
                  <li>A few is ok, but many will make the AI think that is a feature of the person and not the specific image.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 2 Content -->
          <div v-if="currentStep === 2">
            <h3 class="text-xl font-semibold">Step 2: Start Training</h3>
            <p class="text-sm text-gray-400 mb-4">Note: this training process only has to be done once per person.</p>
            <div class="ml-4 space-y-3">
              <p>When ready, click the "Train" button.</p>
              <p>The AI will take about 1 hour to process and make the model available for you to create images.
                You can leave this page/website and return later.</p>
              <p><span class="underline font-medium">Done!</span> After training, go to the "Create Images" page, select your model and create your images.</p>
              <p class="text-sm text-gray-400">Note: The model will only show up in the "Create Images" page if it has finished training.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1)
const steps = [
  { label: 'Create Model', command: () => setStep(1) },
  { label: 'Train Model', command: () => setStep(2) }
]

const setStep = (step: number) => {
  currentStep.value = step
}
</script>
