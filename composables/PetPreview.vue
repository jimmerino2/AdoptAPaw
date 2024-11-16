<script setup>
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();

const props = defineProps({
  pet: Object,
});

const emit = defineEmits(["selectPet"]); // Define the event
const selectPet = () => {
  emit("selectPet", props.pet); // Emit the selected pet object
};
</script>

<template>
  <HoverCard>
    <HoverCardTrigger class="hover:cursor-pointer" v-on:click="selectPet()">
      <div
        class="border border-black rounded-md bg-slate-400"
        :class="{
          'w-[12rem]': width >= 1500,
          'w-[10rem]': width < 1500 && width >= 1000,
          'w-[9.5rem]': width < 1000 && width >= 768,
          'w-[9rem]': width < 768 && width >= 450,
          'w-[8rem]': width < 450 && width >= 400,
          'w-[9rem]': width < 400,
        }"
      >
        <img
          src="assets\images\logo_v1.png"
          alt="pet_image"
          class="bg-slate-100 size-full rounded-md"
        />

        <div class="flex flex-col items-center">
          <div class="text-lg font-bold">{{ props.pet?.name }}</div>
          <div class="text-lg text-center w-3/4 truncate py-2">
            {{ props.pet?.age }}yo | {{ props.pet?.breed }}
          </div>
        </div>
      </div>
    </HoverCardTrigger>

    <HoverCardContent class="bg-slate-300">
      <div class="size-fit">
        <div class="flex flex-row items-center">
          <img src="" alt="pet_icon" class="size-[3rem] border border-black" />
          <div class="text-lg m-2">{{ props.pet?.name }}</div>
        </div>
        <div class="text-md m-2">{{ props.pet?.gender }}</div>
        <div class="text-md m-2">{{ props.pet?.breed }}</div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
