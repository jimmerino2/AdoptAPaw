<script setup>
import axios from "axios";
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

// Steps for parsing props to child components
// 1. Import the child component
// 2. Define the props (ref) in the parent component
// 3. Pass the props (ref) to the child component

const petData = ref([]);
const agentData = ref([]);
const selectedPet = ref({});
const selectedAgent = ref({});
const showDetails = ref(false);
const petAgeType = ref(null);
const toggleContent = ref(false); // 0 - About,  1 - Agent

const handlePetDetails = (pet) => {
  selectedPet.value = pet;
  selectedAgent.value = agentData.value.find(
    (agent) => agent._id === pet.agentID
  );
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
  console.log("Scrolled!");
};

onMounted(async () => {
  // Axios syntax fetch pet data
  const responsePet = await axios.get("http://localhost:5001/pets/getPetData");
  const responseAgent = await axios.get(
    "http://localhost:5001/agents/getAgentData"
  );

  petData.value = responsePet.data;
  agentData.value = responseAgent.data;
});
</script>

<template>
  <!-- Pet Preview -->
  <div
    v-show="!showDetails"
    class="h-fit py-4 flex flex-col items-center bg-slate-300 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
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
    <div
      v-on:click="showDetails = !showDetails"
      class="bg-slate-100 hover:cursor-pointer size-[2rem] border border-black fixed right-2.5 top-[5.25rem] flex text-[2rem] items-center justify-center z-20"
    >
      X
    </div>
    <div class="w-full">
      <img src="" alt="pet_image" class="w-full max-h-[20rem] min-h-[1rem]" />
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
      <div class="pt-4">
        <Button>Adopt {{ selectedPet.name }}</Button>
      </div>
    </div>
    <div class="w-full my-4 sticky top-[64px] z-10">
      <Menubar>
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
          <MenubarTrigger
            class="hover:cursor-pointer"
            v-on:click="scrollToTop()"
            ><div class="">Back to Start</div></MenubarTrigger
          >
        </MenubarMenu>
      </Menubar>
    </div>

    <!-- Pet Info -->
    <div v-show="!toggleContent" class="py-4 bg-slate-300 w-full p-4">
      <p class="text-[1.5rem] font-bold">About</p>
      <p class="pt-2 text-[1rem] font-bold">Description</p>
      <p class="pt-1 text-[0.9rem]">{{ selectedPet.desc }}</p>

      <!-- Health and Training -->
      <p class="pt-2 text-[1rem] font-bold">Health and Training</p>
      <p class="pt-1 text-[0.9rem]">(WIP) isVaccinated</p>
      <p class="pt-1 text-[0.9rem]">(WIP) isSpayed</p>
      <p class="pt-1 text-[0.9rem]">
        The pet has a coat length of {{ selectedPet.coatLength }}cm.
      </p>
      <p class="pt-1 text-[0.9rem]">
        This pet is
        <span v-show="!selectedPet.isToiletTrained">NOT</span> toilet trained.
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
      <p class="text-[1.5rem] font-bold">{{}}</p>
    </div>
  </div>
</template>
