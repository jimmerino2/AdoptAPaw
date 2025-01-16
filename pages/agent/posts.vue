<script setup>
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";

definePageMeta({
  middleware: ["auth", "agentaccept"],
});
const { width } = useWindowSize();
const { fetchData } = useFetchData();
const user = useSupabaseUser();
const client = useSupabaseClient();

const adoptedPets = ref();
const listedPets = ref();
const userId = await fetchData("users", "id", ["user_id", user.value.id]);
const agentId = await fetchData("agents", "id", ["uid", userId[0].id]);
const { data } = await client
  .from("pets")
  .select("*")
  .eq("agentid", agentId[0].id)
  .eq("status", "active");

adoptedPets.value = data.filter((pet) => pet.isadopted === true);
listedPets.value = data.filter((pet) => pet.isadopted === false);

const accordionData = ref([]);
accordionData.value = [
  {
    value: "listed",
    label: "Adoptable (" + listedPets.value.length + ")",
    data: listedPets.value,
  },
  {
    value: "adopted",
    label: "Adopted (" + adoptedPets.value.length + ")",
    data: adoptedPets.value,
  },
];

async function deleteListing(pet) {
  const { data, error } = await client
    .from("pets")
    .update({
      status: "removed",
    })
    .eq("id", pet.id);
  if (error) {
    console.log(error);
  }
  refreshData();
}

async function refreshData() {
  const { data } = await client
    .from("pets")
    .select("*")
    .eq("agentid", agentId[0].id)
    .eq("status", "active");
  adoptedPets.value = data.filter((pet) => pet.isadopted === true);
  listedPets.value = data.filter((pet) => pet.isadopted === false);

  accordionData.value = [
    {
      value: "listed",
      label: "Adoptable (" + listedPets.value.length + ")",
      data: listedPets.value,
    },
    {
      value: "adopted",
      label: "Adopted (" + adoptedPets.value.length + ")",
      data: adoptedPets.value,
    },
  ];
}
</script>

<template>
  <div
    class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] pt-2 pb-10"
  >
    <!-- Title -->
    <div class="mx-2 px-2 flex flex-col items-center">
      <p class="text-[2.5rem]">Posted Listings</p>
      <p class="text-lg text-center py-2">
        Navigate and manage your existing listings
      </p>
    </div>

    <!-- Accordion -->
    <div v-if="data.length > 0" class="w-full">
      <Accordion
        type="single"
        class="w-full"
        collapsible
        default-value="listed"
      >
        <AccordionItem v-for="inputs in accordionData" :value="inputs.value">
          <AccordionTrigger
            class="border bg-white p-2 border-gray-200 hover:no-underline"
            >{{ inputs.label }}
          </AccordionTrigger>
          <AccordionContent class="border bg-white p-2 border-gray-200">
            <div
              v-if="inputs.data.length > 0"
              class="grid"
              :class="{
                'grid-cols-1': width <= 650,
                'grid-cols-2': width > 650 && width <= 1023,
                'grid-cols-3': width > 1023 && width <= 1500,
                'grid-cols-4': width > 1500 && width <= 1800,
                'grid-cols-5': width > 1800,
              }"
            >
              <div
                v-for="items in inputs.data"
                class="p-2 relative justify-self-center"
              >
                <div class="absolute top-5 right-5 flex justify-between w-fit">
                  <NuxtLink
                    :to="{
                      path: '/agent/addPost',
                      query: {
                        petid: items.id,
                        agentid: items.agentid,
                        edit: true,
                      },
                    }"
                    class="hover:cursor-pointer mr-2"
                    v-show="inputs.value === 'listed'"
                  >
                    <div class="bg-white p-2 rounded-full">
                      <img src="/edit_icon.png" class="size-6" />
                    </div>
                  </NuxtLink>
                  <NuxtLink
                    class="hover:cursor-pointer"
                    :to="{
                      path: '/adoption/details',
                      query: {
                        origin: 'posts',
                        petid: items.id,
                        agent: items.agentid,
                      },
                    }"
                  >
                    <div class="bg-white p-2 rounded-full">
                      <img src="/view_icon.jpg" class="size-6" />
                    </div>
                  </NuxtLink>
                  <div
                    class="bg-white p-2 rounded-full hover:cursor-pointer ml-2"
                    v-show="inputs.value === 'listed'"
                    @click="deleteListing(items)"
                  >
                    <img src="/trash_icon.png" class="size-6" />
                  </div>
                </div>
                <PetPreview
                  :pet="items"
                  class="max-w-[275px] hover:cursor-default"
                />
              </div>
            </div>
            <div v-else>No pets in this category</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <!-- Buttons -->
    <div class="fixed bottom-5 right-5">
      <Button as-child
        ><NuxtLink to="/agent/addPost">Add Listing</NuxtLink>
      </Button>
    </div>
  </div>
</template>
