<template>
  <section class="w-full py-16">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <LazyScriptStripePricingTable
        :pricing-table-id="'prctbl_1QDp2D1BO16AwcyZNWPX5eG5'"
        :publishable-key="'pk_live_51Pv0md1BO16AwcyZZ0veDulS5rW6IVhQsUOmcgswndsyi5mkuzq4sjt3fOKS5jMEroilhMjYtNNUhixL800tqd7Q00AoYDlb1c'"
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