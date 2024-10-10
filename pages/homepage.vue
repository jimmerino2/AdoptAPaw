<script setup lang="ts">
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import HomepageSearch from '~/components/ui/HomepageSearch.vue';

</script>

<template>
  <Header />

  <!-- #region Search Area -->
  <div class="relative w-auto h-[35rem] border border-black flex flex-col items-center p-4 z-0">
    <div class="top-10 text-[3rem] p-5 pt-12">AdoptAPaw</div>
    <div class="top-10 text-[1.5rem] p-5">What would you like to do today?</div>
    <HomepageSearch class="top-[12rem]"/>
    <div class="absolute top-[25rem] grid w-1/2 cols-4 grid-flow-col gap-4 grid-cols-auto-fill justify-around">
      <div class="flex m-2 size-48 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        Adopt
      </div>
      <div class="flex m-2 size-48 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        Shelters
      </div>
      <div class="flex m-2 size-48 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        FAQ
      </div>
      <div class="flex m-2 size-48 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        Donate
      </div>
    </div>
  </div>
  <!-- #endregion -->
  <Footer />
</template>

<style>
  body{
    margin:0px;
    }
</style>