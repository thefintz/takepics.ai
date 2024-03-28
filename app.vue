<template>
  <main>
    <div class="card">
      <Menubar :model="items" />
    </div>
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
const router = useRouter();
const { signIn, signOut, status } = useAuth();

interface Item {
  label: string;
  icon: string;
  command: () => void;
}

const items = ref<Item[]>([
  { label: "Home", icon: "pi pi-home", command: () => router.push("/") },
]);

if (status.value === "unauthenticated") {
  items.value.push({
    label: "Login",
    icon: "pi pi-sign-in",
    command: () => signIn("auth0"),
  });
}

if (status.value === "authenticated") {
  items.value.push({
    label: "Profile",
    icon: "pi pi-user",
    command: () => router.push("/me"),
  });
  items.value.push({
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => signOut({ callbackUrl: "/" }),
  });
}
</script>

<style>
@import url("primevue/resources/themes/aura-dark-blue/theme.css");
@import url("primeicons/primeicons.css");
</style>
