<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();
const props = defineProps({
  user: Object,
  showDetails: Boolean,
});

const emit = defineEmits(["selectPet"]);

const imagePath = ref("");
const agent = ref({ city: "" });

async function updateDetails(user) {
  if (!user) return;

  user.imagepath == null
    ? (imagePath.value = "/profile-icon.png")
    : (imagePath.value = fetchImage(user.imagepath));

  if (user.role === "Agent") {
    const data = await fetchData("agents", "city", ["uid", user.id]);
    agent.value = data[0] || null;
  }
}

watch(
  () => props.user,
  async (newUser) => {
    updateDetails(newUser);
  },
  { immediate: true } // Run immediately on mount
);
</script>

<template>
  <div class="mt-10" :class="{ 'min-w-[350px]': width >= 360 }">
    <Card
      class="m-6 bg-beige-300 hover:shadow-xl hover:scale-[101%] ease-in duration-100 max-w-[300px] h-[420px]"
    >
      <CardHeader class="relative">
        <CardTitle class="flex flex-col items-center">
          <div
            class="absolute top-[-40px] border-4 border-white size-28 left-1/2 transform -translate-x-1/2 overflow-hidden rounded-full"
          >
            <Avatar class="size-full bg-orange-200">
              <AvatarImage v-if="user.imagepath" :src="imagePath" />
              <AvatarImage v-else src="/profile-icon.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <p class="mt-16 mb-2 text-center text-xl">{{ user.name }}</p>
          <p class="text-lg">{{ user.role }}</p>
          <hr class="mt-2 border border-black w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent class="h-[180px]">
        <!-- Common Details-->
        <div>
          <h1 class="font-bold">Email</h1>
          <p class="mb-2 text-sm">{{ user.email }}</p>
          <h1 class="font-bold">Contact</h1>
          <p class="mb-2 text-sm">{{ user.contact }}</p>
        </div>
        <!-- Agent Detail -->
        <div v-if="agent.city !== ''">
          <h1 class="font-bold">City</h1>
          <p class="text-sm">{{ agent.city }}</p>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col" v-show="props?.showDetails">
        <Button class="bg-orange-600 hover:bg-orange-500" as-child>
          <NuxtLink :to="{ path: '/agent/details', query: { id: user?.id } }">
            See Details
          </NuxtLink></Button
        >
      </CardFooter>
    </Card>
  </div>
</template>
