<script setup>
import { useWindowSize } from "@vueuse/core";
const { fetchData, fetchImage } = useFetchData();
const { width } = useWindowSize();

definePageMeta({
  middleware: ["agentreject"],
});

const route = useRoute();
const petId = route.query.petid;
const fetchedPetDetails = await fetchData(
  "pets",
  "*, medicalrecord(*), agents(*, users(*))",
  ["id", petId]
);
const selectedPet = fetchedPetDetails[0];

const showDetails = ref(false);
const toggleContent = ref(false); // 0 - About,  1 - Agent

const petAgeType = ref(null);
if (selectedPet.age <= 2) {
  if (selectedPet.type === "Cat") {
    petAgeType.value = "Kitten";
  } else {
    petAgeType.value = "Puppy";
  }
} else {
  petAgeType.value = "Adult";
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<template>
  <div
    class="h-full flex flex-col items-center bg-slate-100 custom-lg:px-[10vw] custom-md:px-[4vw]"
  >
    <!-- Image Section-->
    <div class="w-full flex overflow-visible">
      <div class="bg-slate-800 grow"></div>
      <div class="h-full overflow-hidden bg-slate-200">
        <img
          :src="fetchImage(selectedPet.imagepath)"
          alt="pet_image"
          class="w-auto min-h-[16rem] max-h-[20rem]"
        />
      </div>
      <div class="bg-slate-800 grow"></div>
    </div>

    <!-- Top Section-->
    <div class="w-full">
      <div
        class="flex-col bg-slate-200 w-full flex items-center justify-center py-4"
      >
        <div class="text-[2rem] font-bold">{{ selectedPet.name }}</div>
        <hr class="w-[90%] my-2 border border-zinc-400" />
        <div class="py-1 flex text-lg">
          <img
            v-if="selectedPet.gender == 'Female'"
            src="/public/gender_f.png"
            class="size-8 mr-2"
          />
          <img
            v-if="selectedPet.gender == 'Male'"
            src="/public/gender_m.png"
            class="size-8 mr-2"
          />
          {{ selectedPet.breed }}
        </div>
        <div class="py-1 w-full justify-center flex">
          {{ petAgeType }} <span>&nbsp;({{ selectedPet.age }}yo)</span>
        </div>

        <NuxtLink
          :to="{
            path: '/adoption/schedule',
            query: { petId: petId },
          }"
        >
          <Button class="mt-4">Adopt {{ selectedPet.name }}</Button>
        </NuxtLink>
      </div>

      <Menubar class="w-full top-14 py-5 z-10" v-show="width <= 768">
        <MenubarMenu>
          <MenubarTrigger
            class="hover:cursor-pointer"
            v-on:click="toggleContent = false"
            ><div class="">About</div></MenubarTrigger
          >
          <MenubarTrigger
            class="hover:cursor-pointer"
            v-on:click="toggleContent = true"
            ><div class="">Agent or Shelter</div></MenubarTrigger
          >
        </MenubarMenu>
      </Menubar>
    </div>

    <!-- Details Section -->
    <div class="w-full" :class="{ flex: width > 768 }">
      <!-- Pet Info -->
      <div
        v-show="!toggleContent || width > 768"
        class="py-4 bg-slate-300 w-full p-4"
      >
        <p class="text-2xl font-bold">Pet</p>
        <!-- Description -->
        <p class="pt-2 text-xl font-bold">Description</p>
        <p class="pt-1 text-md">{{ selectedPet.description }}</p>

        <!-- Pet Details -->
        <div class="" :class="{ 'flex mr-10': width > 1210 }">
          <!-- Health and Training -->
          <div class="grow max-w-[400px]">
            <p class="pt-2 text-xl font-bold">Health and Training</p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="
                  selectedPet.medicalrecord?.some(
                    (record) => record.isvaccinated
                  )
                "
                src="/public/vaccination_t.png"
                class="size-8"
              />
              <img v-else src="/public/vaccination_f.png" class="size-8" />
              {{
                ((vaccinationRecord) =>
                  vaccinationRecord
                    ? "Vaccinated on " + vaccinationRecord.vaccinationdate + "."
                    : "Not vaccinated.")(
                  selectedPet.medicalrecord?.reduce((latest, record) => {
                    if (
                      record.isvaccinated &&
                      (!latest ||
                        new Date(record.vaccinationdate) >
                          new Date(latest.vaccinationdate))
                    ) {
                      return record;
                    }
                    return latest;
                  }, null)
                )
              }}
            </p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="
                  selectedPet.medicalrecord?.some((record) => record.isneutered)
                "
                src="/public/neuter_t.png"
                class="size-8"
              />
              <img v-else src="/public/neuter_f.png" class="size-8" />
              {{
                ((neuterRecord) =>
                  neuterRecord
                    ? "Neutered or spayed on " + neuterRecord.neuterdate + "."
                    : "Not Neutered or spayed.")(
                  selectedPet.medicalrecord?.reduce((latest, record) => {
                    if (
                      record.isneutered &&
                      (!latest ||
                        new Date(record.neuterdate) >
                          new Date(latest.neuterdate))
                    ) {
                      return record;
                    }
                    return latest;
                  }, null)
                )
              }}
            </p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="selectedPet?.istoilettrained"
                src="/public/toilet_t.png"
                class="size-8"
              />
              <img v-else src="/public/toilet_f.png" class="size-8" />
              This pet is
              <span v-show="!selectedPet.istoilettrained">not</span> toilet
              trained.
            </p>
          </div>

          <!-- Personality -->
          <div class="">
            <p class="pt-2 text-xl font-bold">Personality</p>
            <ul>
              <li
                class="pt-1 text-md capitalize"
                v-for="n in selectedPet.personality"
              >
                {{ n }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Agent Info-->
      <div
        v-show="toggleContent || width > 768"
        class="py-4 bg-slate-300 w-full p-4"
      >
        <p class="text-2xl font-bold">Agent</p>
        <!-- Name -->
        <p class="pt-2 text-xl font-bold">Name</p>
        <p class="pt-1 text-md">{{ selectedPet.agents.users.name }}</p>

        <!-- Address -->
        <p class="pt-2 text-xl font-bold">Address</p>
        <p class="pt-1 text-md">{{ selectedPet.agents.address }}</p>

        <!-- Contact -->
        <p class="pt-2 text-xl font-bold">Contact</p>
        <p class="pt-1 text-md">Email: {{ selectedPet.agents.users.email }}</p>
        <p class="pt-1 text-md">
          Number: +{{ selectedPet.agents.users.contact }}
        </p>

        <div v-show="selectedPet.agents.type == 'Shelter'">
          <p class="pt-2 text-xl font-bold">Working Hours</p>
          <p
            class="pt-1 text-md"
            v-for="hours in selectedPet.agents.workinghrs"
          >
            {{ hours }}
          </p>
        </div>
      </div>
    </div>

    <!-- Fixed Buttons -->
    <Button
      class="hover:cursor-pointer fixed bottom-[10px] right-[10px] flex size-[ items-center justify-center z-20"
      as-child
    >
      <NuxtLink to="/adoption/listings">Back to Listings</NuxtLink>
    </Button>

    <Button
      v-on:click="scrollToTop()"
      class="hover:cursor-pointer fixed bottom-[60px] right-[10px] flex size-[ items-center justify-center z-20"
      v-show="width <= 768"
      >Back to Top</Button
    >
  </div>
</template>
