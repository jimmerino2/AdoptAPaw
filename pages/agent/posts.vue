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
  .select("*, agents(*)")
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
  const { error } = await client
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
    .select("*, agents(*)")
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
  <div class="scaling pt-2 pb-10">
    <!-- Title -->
    <div class="mx-2 p-8 flex flex-col items-center w-full">
      <p class="text-3xl text-center">Posted Listings</p>
      <p class="text-lg text-center py-2">
        Navigate and manage your existing listings
      </p>
      <Button as-child class="bg-orange-700 hover:bg-orange-600"
        ><NuxtLink to="/agent/addPost">Add Listing</NuxtLink>
      </Button>
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
            class="bg-white p-2 hover:no-underline bg-orange-300 rounded-t-md focus:bg-orange-400"
            >{{ inputs.label }}
          </AccordionTrigger>
          <AccordionContent
            class="border-x bg-white p-2 rounded-b-md bg-beige-200"
          >
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
                <div
                  class="absolute top-5 right-5 flex justify-between z-20 opacity-75"
                >
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
                    <div
                      class="bg-orange-200 p-2 rounded-full hover:bg-white transition ease-in hover:scale-110"
                    >
                      <img src="/edit_icon.png" class="size-6" />
                    </div>
                  </NuxtLink>
                  <NuxtLink
                    class="hover:cursor-pointer"
                    :to="{
                      path: '/adoption/details',
                      query: {
                        petid: items.id,
                        agent: items.agentid,
                      },
                    }"
                  >
                    <div
                      class="bg-orange-200 p-2 rounded-full hover:bg-white transition ease-in hover:scale-110"
                    >
                      <img src="/view_icon.png" class="size-6" />
                    </div>
                  </NuxtLink>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div
                        class="p-2 rounded-full hover:cursor-pointer ml-2 bg-orange-200 hover:bg-white transition ease-in hover:scale-110"
                        v-show="inputs.value === 'listed'"
                      >
                        <img src="/trash_icon.png" class="size-6" />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent class="bg-beige-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                        <AlertDialogDescription class="text-black"
                          >Are you sure you want to delete {{ items.name }}'s
                          listing.</AlertDialogDescription
                        >
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          class="bg-orange-500 hover:bg-orange-400 text-white"
                          >Cancel</AlertDialogCancel
                        >
                        <AlertDialogAction
                          @click="deleteListing(items)"
                          class="bg-emerald-500 hover:bg-emerald-400"
                          >Confirm</AlertDialogAction
                        >
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <PetPreview :pet="items" class="hover:cursor-default" />
              </div>
            </div>
            <div v-else>No pets in this category</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
