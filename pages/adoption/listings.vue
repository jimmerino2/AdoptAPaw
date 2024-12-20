<script setup>
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";
const { fetchData, fetchImage } = useFetchData();

const { width } = useWindowSize();

const petData = await fetchData("pets");
const agentData = await fetchData("agents");
let selectedPet = ref({});
let selectedAgent = ref({});
const showDetails = ref(false);
const petAgeType = ref(null);
const toggleContent = ref(false); // 0 - About,  1 - Agent

const handlePetDetails = (pet) => {
  selectedPet = pet;
  selectedAgent = agentData.find((agent) => agent.id === pet.agentid);
};

const findAge = (pet) => {
  if (pet.age <= 2) {
    if (pet.type === "Cat") {
      petAgeType.value = "Kitten";
    } else {
      petAgeType.value = "Puppy";
    }
  } else {
    petAgeType.value = "Adult";
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<template>
  <!-- Pet Preview -->
  <div
    v-show="!showDetails"
    class="h-fit py-4 flex flex-col items-center bg-slate-200 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
  >
    <div class="mx-2 px-2 flex flex-col items-center py-8">
      <p class="text-[2.5rem]">Find a Pet</p>
      <p class="text-lg text-center py-2">
        Browse through our listings to find a suitable pet for adoption!
      </p>
    </div>

    <div
      class="w-full grid gap-6 px-2 max-w-[1200px]"
      :class="{
        'grid-cols-4': width >= 1500,
        'grid-cols-3': width >= 1000,
        'grid-cols-2': width < 1000 && width >= 576,
        'grid-cols-1': width < 576,
      }"
    >
      <div v-for="pet in petData" :key="pet._id" class="">
        <div v-on:click="(showDetails = !showDetails), (toggleContent = false)">
          <PetPreview
            :pet="pet"
            @selectPet="handlePetDetails(pet), findAge(pet), scrollToTop()"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Pet Details -->
  <div
    v-show="showDetails"
    class="h-full flex flex-col items-center bg-slate-100 custom-lg:px-[10vw] custom-md:px-[4vw]"
  >
    <!-- Top Section-->
    <div class="w-full">
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

      <div
        class="flex-col bg-slate-200 w-full flex items-center justify-center py-4"
      >
        <div class="text-[2rem] font-bold">{{ selectedPet.name }}</div>
        <hr class="w-[90%] my-2 border border-zinc-400" />
        <div class="py-1">
          {{ selectedPet.breed }}&nbsp; | &nbsp;{{ selectedPet.location }}
        </div>
        <div class="py-1 w-[90%] flex justify-around">
          <div class="w-[33%] text-left ml-2">
            {{ petAgeType }} <span>({{ selectedPet.age }}yo)</span>
          </div>
          <div class="w-[33%] text-center">{{ selectedPet.gender }}</div>
          <div class="w-[33%] text-right mr-2">{{ selectedPet.weight }}kg</div>
        </div>

        <NuxtLink
          :to="{
            path: '/adoption/schedule',
            query: { petId: selectedPet.id },
          }"
        >
          <Button class="mt-4">Adopt {{ selectedPet.name }}</Button>
        </NuxtLink>
      </div>

      <Menubar class="w-full top-14 py-5 z-10">
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

    <!-- Pet Info -->
    <div v-show="!toggleContent" class="py-4 bg-slate-300 w-full p-4">
      <p class="text-[1.5rem] font-bold">About</p>
      <p class="pt-2 text-[1rem] font-bold">Description</p>
      <p class="pt-1 text-[0.9rem]">{{ selectedPet.description }}</p>

      <!-- Health and Training -->
      <p class="pt-2 text-[1rem] font-bold">Health and Training</p>
      <p class="pt-1 text-[0.9rem]">(WIP) isVaccinated</p>
      <p class="pt-1 text-[0.9rem]">(WIP) isSpayed</p>
      <p class="pt-1 text-[0.9rem]">
        The pet has a coat length of {{ selectedPet.coatlength }}cm.
      </p>
      <p class="pt-1 text-[0.9rem]">
        This pet is
        <span v-show="!selectedPet.istoilettrained">NOT</span> toilet trained.
      </p>

      <!-- Personality -->
      <p class="pt-2 text-[1rem] font-bold">Personality</p>
      <ul>
        <li
          class="pt-1 text-[0.9rem] capitalize"
          v-for="n in selectedPet.personality"
        >
          {{ n }}
        </li>
      </ul>
    </div>

    <!-- Agent Info-->
    <div v-show="toggleContent" class="py-4 bg-slate-300 w-full p-4">
      <p class="text-[1.5rem] font-bold">Agent</p>
      <p class="pt-2 text-[1rem] font-bold">Description</p>
      <p class="pt-1 text-[0.9rem]">{{ selectedAgent.description }}</p>
      <p class="pt-2 text-[1rem] font-bold">Mission</p>
      <p class="pt-1 text-[0.9rem]">{{ selectedAgent.mission }}</p>

      <!-- Address -->
      <p class="pt-2 text-[1rem] font-bold">Address</p>
      <p class="pt-1 text-[0.9rem]">{{ selectedAgent.address }}</p>

      <!-- Contact -->
      <p class="pt-2 text-[1rem] font-bold">Contact</p>
      <p class="pt-1 text-[0.9rem]">Email: {{ selectedAgent.email }}</p>
      <p class="pt-1 text-[0.9rem]">Number: +{{ selectedAgent.contact }}</p>

      <div v-show="selectedAgent.type == 'Shelter'">
        <p class="pt-2 text-[1rem] font-bold">Working Hours</p>
        <p class="pt-1 text-[0.9rem]" v-for="hours in selectedAgent.workinghrs">
          {{ hours }}
        </p>
      </div>
    </div>

    <!-- Fixed Buttons -->
    <Button
      v-on:click="showDetails = !showDetails"
      class="hover:cursor-pointer fixed bottom-[10px] right-[10px] flex size-[ items-center justify-center z-20"
      >Back to Listings</Button
    >
    <Button
      v-on:click="scrollToTop()"
      class="hover:cursor-pointer fixed bottom-[60px] right-[10px] flex size-[ items-center justify-center z-20"
      >Back to Top</Button
    >
  </div>
</template>
