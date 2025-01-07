<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  middleware: ["auth", "agentreject"],
});

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();

const client = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();

// #region Data Parsing
const fetchedPetData = ref([]);
const fetchedUserData = ref([]);
const userData = ref({});
const petData = ref([]);

async function updateData() {
  fetchedUserData.value = await fetchData("users", "*", [
    "user_id",
    user.value.id,
  ]);
  userData.value = fetchedUserData.value[0];
  fetchedPetData.value = await client
    .from("pets")
    .select("*")
    .in("id", userData.value.favorites);
  petData.value = fetchedPetData.value.data;
}
await updateData();
// #endregion

async function sendPetData(pet) {
  router.push({
    path: "/adoption/listings",
    query: { petid: pet.id, toggle: true },
  });
}

async function updateFavorite(petId) {
  try {
    const fetchedUpdatedUserData = await fetchData("users");
    const updatedUserData = fetchedUpdatedUserData[0];

    if (updatedUserData.favorites.includes(petId)) {
      // Remove the petId from favorites
      const updatedFavorites = updatedUserData.favorites.filter(
        (id) => id !== petId
      );
      await client
        .from("users")
        .update({ favorites: updatedFavorites })
        .eq("id", updatedUserData.id);
    } else {
      // Add the petId to favorites
      const updatedFavorites = [...updatedUserData.favorites, petId];
      await client
        .from("users")
        .update({ favorites: updatedFavorites })
        .eq("id", updatedUserData.id);
    }
    updateData();
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}
</script>

<template>
  <div
    class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] pt-2 pb-10"
    :class="{ flex: width >= 1024 }"
  >
    <ProfileCard />
    <div
      class="grow rounded-md bg-slate-300"
      :class="{ 'mt-16': width >= 1024 }"
    >
      <div class="p-4 flex items-center flex-col w-full h-full bg-slate-100">
        <h1 class="text-2xl px-4 font-bold">Favorite List</h1>
        <div
          v-if="petData.length > 0"
          class="w-full h-full grid flex"
          :class="{
            'grid-cols-1': width <= 725 || (width > 1023 && width <= 1250),
            'grid-cols-2':
              (width > 725 && width <= 1023) || (width > 1250 && width <= 1600),
            'grid-cols-3': width > 1600 && width <= 1900,
            'grid-cols-4': width > 1900,
          }"
        >
          <div
            v-for="i in petData"
            :key="i.id"
            class="justify-self-center p-4 relative"
          >
            <div
              class="absolute top-6 right-6 max-w-12"
              @click="updateFavorite(i.id)"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      v-if="userData.favorites.includes(i.id)"
                      src="/public/fav_filled.png"
                    />
                    <img v-else src="/public/fav_empty.png" />
                  </TooltipTrigger>
                  <TooltipContent v-if="userData.favorites.includes(i.id)"
                    >Remove From Favorites</TooltipContent
                  >
                  <TooltipContent v-else>Add to Favorites</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <PetPreview :pet="i" @selectPet="sendPetData(i)" />
          </div>
        </div>
        <div
          v-else
          class="justify-center h-full w-full flex flex-col items-center"
        >
          <p class="text-xl">No favorite pets</p>
          <NuxtLink to="/adoption/listings">
            <Button class="m-8">Find Pet Listings</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
