<script setup>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import PetPreview from '~/components/ui/PetPreview.vue';
import axios from "axios";
import { ref } from 'vue';
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize();

// Steps for parsing props to child components
// 1. Import the child component
// 2. Define the props (ref) in the parent component
// 3. Pass the props (ref) to the child component

const petData = ref([]);
const selectedPet = ref({});
const showDetails = ref(false);

const handlePetDetails = (pet) =>{
  selectedPet.value = pet;
} 

onMounted(async () => {
  // Axios syntax fetch pet data
  const response = await axios.get("http://localhost:5001/pets/getPetData");

  petData.value = response.data;
});
</script>

<template>
  <Header />

  <!-- Pet Preview -->
  <div v-show="!showDetails" class="h-fit py-4 flex flex-col items-center bg-slate-300 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]">
    <div class="mx-2 px-2 flex flex-col items-center py-8">
      <p class="text-[2.5rem]">Find a Pet</p>
      <p class="text-lg text-center py-2">Browse through our listings to find a suitable pet for adoption!</p>
    </div>

    <div class="w-full grid gap-12 px-2" :class="{
        'grid-cols-5': width >= 1000,
        'grid-cols-4': width < 1000 && width >= 768,
        'grid-cols-3': width < 768 && width >= 400,
        'grid-cols-2': width < 400
    }">
        <div v-for="pet in petData" :key="pet._id" class="flex justify-center">
          <div v-on:click="showDetails = !showDetails"><PetPreview :pet="pet" @selectPet="handlePetDetails(pet)"/></div>
        </div>
    </div>
  </div>

  <!-- Pet Details -->
   <div v-show="showDetails" class="h-fit flex flex-col items-center bg-slate-100 custom-lg:px-[10vw] custom-md:px-[4vw]">
      <div v-on:click="showDetails = !showDetails" class="size-[2.5rem] border border-black fixed right-5 top-[6rem] flex text-[2rem] items-center justify-center">X</div>
      <div class="w-full"><img src="" alt="pet_image" class="w-full max-h-[20rem] min-h-[1rem]"></div>
      <div class="flex-col bg-slate-200 w-full flex items-center justify-center py-4">
        <div class="text-[2rem] font-bold">{{ selectedPet.name }}</div>
        <hr class="w-[90%] border border-zinc-400">
        <div>{{ selectedPet.breed }} | {{ selectedPet.location }}</div>
        <div>test</div>
      </div>
   </div>
  <Footer />  
</template>