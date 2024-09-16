<template>
	<form @submit.prevent="() => execute()">
    <Dropdown
        v-model="selectedPrompt"
        :options="promptOptions"
        optionLabel="name"
        optionValue="prompt"
        placeholder="Selecione o estilo"
    />
		<Button label="Generate" type="submit" ></Button>
	</form>
</template>

<script lang="ts" setup>
import type { CreationSelect } from "~/server/utils/db/schema";

const selectedPrompt = ref("");

// Temp
const promptOptions = [
    { name: 'Formula 1', prompt: 'ultra realistic photograph of GABRIELNOVAK, male, as Formula 1 race driver' },
    { name: 'Aurora Boreal', prompt: 'GABRIELNOVAK, male, at night at the Northern Lights Aurora Borealis' },
    {
      name: 'Policial', prompt: 'GABRIELNOVAK, male, as a SWAT Officer. wearing black swat vest, swat helmet,' +
            ' holding pdw'
    },
    {
      name: 'Tarot', prompt: 'GABRIELNOVAK, male, with coiled serpents beautiful detailed romantic art nouveau by' +
            ' alphonse mucha, kay nielsen, yoshitaka amano, and gustav klimt, hauntingly beautiful refined moody' +
            ' dreamscape'
    },
    {
      name: 'GTA', prompt: 'GABRIELNOVAK, male, gta vice city cover art, borderlands style, celshading, trending on ' +
            'artstation, by rhads, andreas rocha, rossdraws, makoto shinkai, laurie greasley, lois van baarle,' +
            ' ilya kuvshinov and greg rutkowski'
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
