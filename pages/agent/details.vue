<script setup>
const route = useRoute();
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";

const { fetchData } = useFetchData();
const { width } = useWindowSize();
const client = useSupabaseClient();
const userId = route.query?.id;
const fetchedUserData = await fetchData("users", "*, agents(*)", [
  "id",
  userId,
]);
const fetchedUser = fetchedUserData[0];

const petData = ref([]);
const { data } = await client
  .from("pets")
  .select("*")
  .eq("agentid", fetchedUser.agents[0].id)
  .eq("isadopted", false)
  .eq("status", "active");
data.length > 0 ? (petData.value = data) : "";
</script>

<template>
  <div
    class="scaling pb-10 flex"
    :class="{
      'flex-row justify-center': width >= 1024,
      'flex-col items-center': width < 1024,
    }"
  >
    <ProfilePreview :user="fetchedUser" :showDetails="false" />
    <div
      class="grow pb-4 m-2 rounded-md bg-beige-200 overflow-hidden"
      :class="{ 'mt-16': width >= 1024 }"
    >
      <div class="p-3 text-2xl text-white bg-orange-600">
        {{ fetchedUser.name }}
      </div>
      <div class="p-3 mb-2">
        <p class="text-xl font-bold">Description</p>
        <p class="text-base">
          {{ fetchedUser.agents[0].description ?? "Not Set" }}
        </p>
      </div>
      <div class="p-3 mb-2">
        <p class="text-xl font-bold">Address</p>
        <p class="text-base">
          {{ fetchedUser.agents[0].address ?? "Not Set" }}
        </p>
      </div>
      <div class="p-3 mb-2">
        <p class="text-xl font-bold">Pets for Adoption</p>
        <div
          class="grid"
          :class="{
            'grid-cols-2': width >= 620 && width < 1024,
            'grid-cols-1': width >= 1024 && width < 1440,
            'grid-cols-3': width >= 1440 && width < 1770,
            'grid-cols-4': width >= 1770,
          }"
        >
          <NuxtLink
            v-if="petData.length > 0"
            v-for="pet in petData"
            class="m-2"
            :to="{
              path: '/adoption/details',
              query: {
                petid: pet.id,
              },
            }"
          >
            <PetPreview :pet="pet" />
          </NuxtLink>
          <p v-else>No available pets for adoption.</p>
        </div>
      </div>
    </div>
  </div>
</template>
