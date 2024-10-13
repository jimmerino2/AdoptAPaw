<script setup>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import PetPreview from '~/components/ui/PetPreview.vue';
import axios from "axios";
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize();

// Steps for parsing props to child components
// 1. Import the child component
// 2. Define the props (ref) in the parent component
// 3. Pass the props (ref) to the child component

const petData = ref([]);

onMounted(async () => {
  // Axios syntax fetch pet data
  const response = await axios.get("http://localhost:5001/pets/getPetData");

  petData.value = response.data;
  console.log(petData.value);
});
</script>

<template>
  <Header />
  <div class="h-fit py-4 flex flex-col items-center bg-slate-300 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]">
    <div class="mx-2 px-2">
      Hello World
    </div>

    <div class="w-full grid gap-12 px-2" :class="{
        'grid-cols-5': width >= 1000,
        'grid-cols-4': width < 1000 && width >= 768,
        'grid-cols-3': width < 768 && width >= 400,
        'grid-cols-2': width < 400
    }">
        <div v-for="pet in petData" :key="pet._id" class="flex justify-center">
          <PetPreview :pet="pet"/>
        </div>
    </div>
  </div>
  <Footer />  
</template>