<script setup lang="ts">
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';
import HomepageSearch from '~/components/ui/HomepageSearch.vue';
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize();

</script>

<template>
  <Header />

  <!-- #region Search Area -->
  <div class="relative h-fit py-4 flex flex-col items-center bg-slate-400 z-0" :class="{
    'px-[10vw]': width>=768,
    'px-[4vw]': width<768
  }">
    <div class="text-[3rem] p-5 pt-12">AdoptAPaw</div>
    <div class="text-[1.5rem] p-5 text-center">What would you like to do today?</div>
    
    <HomepageSearch class="top-[12rem] z-0" :class="{
    'w-[75%]': width>=768,
    'w-[77.5%]': width<768 && width>= 576,
    'w-[80%]': width<576 
    }"/>

    <div class="grid grid-flow-col grid-cols-auto-fill justify-around" :class="{
    'grid-rows-1 mt-[10rem] gap-4': width>=1000,
    'grid-rows-2 mt-[10rem] gap-2': width<1000
    }">
      <div class="flex m-2 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg" :class="{
        'size-[12rem]': width>=768,
        'size-[14rem]': width>=568 && width < 768,
        'size-[11.5rem]': width<568 && width >= 450,
        'size-[10rem]': width<450
      }">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        Adopt
      </div>
      <div class="flex m-2 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg" :class="{
        'size-[12rem]': width>=768,
        'size-[14rem]': width>=568 && width < 768,
        'size-[11.5rem]': width<568 && width >= 450,
        'size-[10rem]': width<450
      }">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        Shelters
      </div>
      <div class="flex m-2 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg" :class="{
        'size-[12rem]': width>=768,
        'size-[14rem]': width>=568 && width < 768,
        'size-[11.5rem]': width<568 && width >= 450,
        'size-[10rem]': width<450
      }">
        <img src="" alt="icon_image" class="size-3/4 border border-black">
        FAQ
      </div>
      <div class="flex m-2 items-center justify-center bg-slate-300 rounded-lg flex-col text-lg" :class="{
        'size-[12rem]': width>=768,
        'size-[14rem]': width>=568 && width < 768,
        'size-[11.5rem]': width<568 && width >= 450,
        'size-[10rem]': width<450
      }">
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