<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  middleware: ["auth", "agentreject"],
});

const { width } = useWindowSize();
const { fetchData } = useFetchData();

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
    .select("*, agents(*)")
    .in("id", userData.value.favorites)
    .eq("status", "active");
  petData.value = fetchedPetData.value.data;
}
await updateData();
// #endregion

async function sendPetData(pet) {
  router.push({
    path: "/adoption/details",
    query: { petid: pet.id },
  });
}

async function updateFavorite(petId) {
  try {
    const fetchedUpdatedUserData = await fetchData("users", "*", [
      "user_id",
      user.value.id,
    ]);
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
  <div class="scaling pb-10" :class="{ flex: width >= 1024 }">
    <ProfileCard />
    <div class="grow rounded-md" :class="{ 'mt-14': width >= 1024 }">
      <div
        v-if="petData.length > 0"
        class="grid flex"
        :class="{
          'grid-cols-1': width <= 678 || (width > 1023 && width <= 1150),
          'grid-cols-2':
            (width > 678 && width <= 1023) || (width > 1150 && width <= 1500),
          'grid-cols-3': width > 1500 && width <= 1800,
          'grid-cols-4': width > 1800,
        }"
      >
        <div
          v-for="i in petData"
          :key="i.id"
          class="justify-self-center p-2 relative"
        >
          <div
            class="absolute top-6 right-6 max-w-12 z-30 hover:scale-125 transition ease-in duration-100"
          >
            <TooltipProvider>
              <Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger
                    ><TooltipTrigger>
                      <img src="/public/fav_filled.png" />
                    </TooltipTrigger>
                    <TooltipContent> Remove From Favorites </TooltipContent>
                  </AlertDialogTrigger>
                  <AlertDialogContent class="bg-beige-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Favorite</AlertDialogTitle>
                      <AlertDialogDescription class="text-black"
                        >Are you sure you want to remove i.name from your
                        favorites?</AlertDialogDescription
                      >
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        class="bg-orange-500 hover:bg-orange-400 text-white"
                        >Cancel</AlertDialogCancel
                      >
                      <AlertDialogAction
                        @click="updateFavorite(i.id)"
                        class="bg-emerald-600 hover:bg-emerald-500"
                        >Confirm</AlertDialogAction
                      >
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Tooltip>
            </TooltipProvider>
          </div>

          <PetPreview :pet="i" @selectPet="sendPetData(i)" />
        </div>
      </div>
      <div
        v-else
        class="justify-center h-full w-full flex flex-col items-center bg-beige-300 mt-2 rounded-lg"
      >
        <p class="text-xl">No favorite pets</p>
        <NuxtLink to="/adoption/listings">
          <Button class="m-8 bg-orange-500 hover:bg-orange-400"
            >Find Pet Listings</Button
          >
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
