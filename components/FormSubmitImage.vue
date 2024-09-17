<template>
  <form @submit.prevent="() => execute()">
    <Dropdown class=" min-w-60 max-w-full " v-model="selectedPrompt" :options="promptOptions" optionLabel="name"
      optionValue="prompt" placeholder="Select style" />
    <Button class="ml-4" label="Create Images" type="submit"></Button>
  </form>
</template>

<script lang="ts" setup>
import type { CreationSelect } from "~/server/utils/db/schema";

const selectedPrompt = ref("");

// Temp
const promptOptions = [
  {
    name: 'Formula 1',
    prompt: 'ultra realistic photograph of GABRIELNOVAK as Formula 1 race driver. Male, green eyes, visible face.'
  },
  {
    name: 'Aurora Borealis',
    prompt: 'close-up photo of GABRIELNOVAK at night at the Northern Lights Aurora Borealis. Male, green eyes, visible face.'
  },
  {
    name: 'SWAT Officer',
    prompt: 'GABRIELNOVAK as a SWAT Officer. Wearing black swat vest written "SWAT", SWAT helmet, holding PDW, wearing black gloves. Male, green eyes, visible face'
  },
  {
    name: 'Art Nouveau Card',
    prompt: 'GABRIELNOVAK with coiled serpents beautiful detailed romantic art nouveau by alphonse mucha, kay nielsen, yoshitaka amano, and gustav klimt, hauntingly beautiful refined moody dreamscape. Male, green eyes, visible face'
  },
  {
    name: 'Tarot Card',
    prompt: 'GABRIELNOVAK as tarot card. Written "Gabriel Novak" in the bottom center of the card.  Male, green eyes, visible face'
  },
  {
    name: 'GTA',
    prompt: 'GABRIELNOVAK gta vice city cover art, borderlands style, celshading, trending on artstation, by rhads, andreas rocha, rossdraws, makoto shinkai, laurie greasley, lois van baarle, ilya kuvshinov and greg rutkowski. Male, green eyes. Wide angle.'
  }
];

const emits = defineEmits({
  /**
   * Emmited when the image response is ready
   */
  response: (data: CreationSelect) => {
    if (!data) return false;
    return true;
  },
});

const postGeneration = async () => {
  if (!selectedPrompt.value) return;

  const data: CreationSelect = await $fetch("/api/inference", {
    method: "POST",
    body: {
      prompt: selectedPrompt.value,
      lora: "https://replicate.delivery/yhqm/NAf0H2U0kO1PMqyBnrzctA37p40SfEAUD9xBec3DeGLqWopNB/trained_model.tar"
    },
  });

  selectedPrompt.value = ""
  emits("response", data);

  return data;
};

const { execute } = await useAsyncData(postGeneration, { immediate: false });
</script>
