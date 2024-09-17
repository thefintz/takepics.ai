<template>
	<Menubar :model="items" class="menubar">
		<template #item="slotProps">
			<a :href="slotProps.item.to" @click.prevent="handleClick(slotProps.item)" :class="[
				'block px-4 py-1',
				isActive(slotProps.item) ? 'text-sky-400 font-bold rounded' : 'text-gray-300'
			]">
				<i :class="slotProps.item.icon"></i>
				<span class="ml-2">{{ slotProps.item.label }}</span>
			</a>
		</template>
	</Menubar>
</template>

<script setup lang="ts">
const router = useRouter();
const { signIn, signOut, status } = useAuth();

type Item = {
	label?: any;
	icon?: any;
	command?: any;
	to?: string;
};

const HOME: Item = {
	label: "Create Images",
	icon: "pi pi-images",
	to: "/",
	command: () => router.push("/"),
};

const TRAIN: Item = {
	label: "Create Model",
	icon: "pi pi-palette",
	to: "/train",
	command: () => router.push("/train"),
};

const INSTRUCTIONS: Item = {
	label: "Instructions",
	icon: "pi pi-map",
	to: "/instructions",
	command: () => router.push("/instructions"),
};

const PROFILE: Item = {
	label: "Profile",
	icon: "pi pi-user",
	to: "/me",
	command: () => router.push("/me"),
};

const LOGIN: Item = {
	label: "Login",
	icon: "pi pi-sign-in",
	to: "/login",
	command: () => signIn("auth0"),
};

const LOGOUT: Item = {
	label: "Logout",
	icon: "pi pi-sign-out",
	to: "/logout",
	command: () => signOut({ callbackUrl: "/" }),
};

const items = ref<Item[]>([HOME, LOGIN]);
if (status.value === "authenticated") {
	items.value = [INSTRUCTIONS, TRAIN, HOME, PROFILE, LOGOUT];
}

const activeRoute = computed(() => router.currentRoute.value.path);

const isActive = (item: Item) => item.to === activeRoute.value;

const handleClick = (item: Item) => {
	if (item.command) {
		item.command();
	}
};
</script>