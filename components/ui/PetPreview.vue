<script setup>
import HoverCard from "@/components/ui/hover-card/HoverCard.vue";
import HoverCardContent from "@/components/ui/hover-card/HoverCardContent.vue";
import HoverCardTrigger from "@/components/ui/hover-card/HoverCardTrigger.vue";

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
      <div class="border border-black rounded-md w-fit h-fit pb-4">
        <img
          src=""
          alt="pet_image"
          class="bg-slate-100 size-[13rem] rounded-md"
        />
        <!-- Loop this -->
        <div class="flex flex-col items-center p-2">
          <div class="text-lg font-bold pb-2">{{ props.pet?.name }}</div>
          <div class="text-sm">{{ props.pet?.age }} yo | {{ props.pet?.breed }}</div>
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
