<script setup>
import HoverCard from "@/components/ui/hover-card/HoverCard.vue";
import HoverCardContent from "@/components/ui/hover-card/HoverCardContent.vue";
import HoverCardTrigger from "@/components/ui/hover-card/HoverCardTrigger.vue";
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize();

const props = defineProps({
  pet: Object,
})

onMounted(() => {
  console.log(props.pet._id);
})
</script>

<template>
  <HoverCard>
    <HoverCardTrigger>
      <div class="border border-black rounded-md h-fit pb-4 bg-slate-400" :class="{
        'w-[12rem]': width>=1500,
        'min-w-[10rem]': width<1500 && width >=1000,
        'w-[9.5rem]': width<1000 && width >=768,
        'w-[9rem]': width<768 && width >=450,
        'w-[8rem]': width<450 && width >=400,
        'w-[10rem]': width<400 
      }">
        <img
          src="assets\css\logo_v1.png"
          alt="pet_image"
          class="bg-slate-100 size-full rounded-md"
        />
        <!-- Loop this -->
        <div class="flex flex-col items-center">
          <div class="text-lg font-bold pb-2">{{ props.pet?.name }}</div>
          <div class="text-sm text-center w-3/4 truncate">{{ props.pet?.age }}yo | {{ props.pet?.breed }}</div>
        </div>
      </div>
    </HoverCardTrigger>

    <HoverCardContent class="bg-zinc-300">
      <div class="size-fit">
        <div class="flex flex-row items-center">
          <img
            src=""
            alt="pet_icon"
            class="size-[3rem] border border-black"
          />
          <div class="text-lg m-2">{{ props.pet?.name }}</div>
        </div>
        <div class="text-md m-2">{{ props.pet?.gender }}</div>
        <div class="text-md m-2">{{ props.pet?.breed }}</div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
