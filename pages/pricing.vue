<template>
  <section class="w-full py-16">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <LazyScriptStripePricingTable
        :pricing-table-id="'prctbl_1Q84prP2aEWXlznlThXwZ00r'"
        :publishable-key="'pk_test_51PxqQFP2aEWXlznl5pMNEs2KFFRxQ4k47rGyUjmmdRJpNYIMqdURdAXlnEOdOhXBL9xoiGKiFbCMEXCKOkedfN5v00FdpFFUiL'"
        v-if="session && session.user"
        :client-reference-id="session.user.id.replace(/\|/g, '_')"
        :customer-email="session.user.email"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
const { data: session } = useAuth();
</script>