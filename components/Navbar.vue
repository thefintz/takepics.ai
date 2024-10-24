<template>
	<Menubar :model="items" class="menubar border-none bg-gray-800 flex justify-center">
		<template #item="slotProps">
			<a
				:href="slotProps.item.to"
				@click.prevent="handleClick(slotProps.item)"
				:class="[
					'block px-6 py-1 transition-colors duration-200 relative',
					isActive(slotProps.item)
						? 'text-sky-400 font-semibold'
						: 'text-gray-300 hover:text-sky-400 hover:bg-sky-900 rounded'
				]"
			>
				<!-- <i :class="slotProps.item.icon"></i> -->
				<span class="">{{ slotProps.item.label }}</span>
				<div
					v-if="isActive(slotProps.item)"
					class="absolute bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 self-center items-center w-1/3 md:w-5/6 h-1 rounded bg-sky-400"
				></div>
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
	label: "Home",
	icon: "pi pi-home",
	to: "/",
	command: () => router.push("/"),
};

const PRICING: Item = {
	label: "Pricing",
	icon: "pi pi-home",
	to: "/pricing",
	command: () => router.push("/pricing"),
};

const CREATEIMAGES: Item = {
	label: "Create Images",
	icon: "pi pi-images",
	to: "/createimages",
	command: () => router.push("/createimages"),
};

const CREATEMODEL: Item = {
	label: "Create Model",
	icon: "pi pi-palette",
	to: "/createmodel",
	command: () => router.push("/createmodel"),
};

const PROFILE: Item = {
	label: "Profile",
	icon: "pi pi-user",
	to: "/profile",
	command: () => router.push("/profile"),
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
	items.value = [HOME, PRICING, CREATEMODEL, CREATEIMAGES, PROFILE, LOGOUT];
}

const activeRoute = computed(() => router.currentRoute.value.path);

const isActive = (item: Item) => item.to === activeRoute.value;

const handleClick = (item: Item) => {
	if (item.command) {
		item.command();
	}
};
</script>
