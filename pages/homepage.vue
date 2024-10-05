<script setup lang="ts">
import Header from '~/components/layout/Header.vue';
import HomepageSearch from '~/components/ui/HomepageSearch.vue';

</script>

<template>
  <Header />
  <div class="relative w-auto h-[35rem] border border-black flex flex-col items-center p-4">
    <div class="top-10 text-[3rem] p-5 pt-12">AdoptAPaw</div>
    <div class="top-10 text-[1.5rem] p-5">What would you like to do today?</div>
    <HomepageSearch class="top-[11rem]"/>
  </div>
</template>

<style>
  body{
    margin:0px;
    }
</style>