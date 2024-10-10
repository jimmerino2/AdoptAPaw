<script setup lang="ts">
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import FilterCheckbox from '~/composable/FilterCheckbox.vue';
import FilterSelect from '~/composable/FilterSelect.vue';
import PetPreview from '~/composable/PetPreview.vue';

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
        <div v-for="n in 12" :key="n">
          <PetPreview />
        </div>
    </div>
  </div>
  <Footer />
</template>