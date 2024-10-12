<script setup>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import FilterCheckbox from '~/components/ui/FilterCheckbox.vue';
import FilterSelect from '~/components/ui/FilterSelect.vue';
import PetPreview from '~/components/ui/PetPreview.vue';
import axios from "axios";

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
  <div class="h-fit px-40 py-4 grid grid-cols-4">
    <div class="mx-2 px-2">
      <FilterSelect category="Type" :selections="['Any', 'Dog', 'Cat']"></FilterSelect>
      <FilterCheckbox category="Breed" :selections="['British Shorthair', 'Corgi']"></FilterCheckbox>
      <FilterSelect category="Age" :selections="['Any', 'Kitten / Puppy', 'Adult']"/>
      <FilterSelect category="Gender" :selections="['Any', 'Male', 'Female']"/>
    </div>

    <div class="grid grid-cols-5 col-span-3 gap-4 px-2">
        <div v-for="pet in petData" :key="pet._id">
          <PetPreview :pet="pet" />
        </div>
    </div>
  </div>
  <Footer />  
</template>