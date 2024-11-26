<script setup>
import { useFetchData } from "@/composables/useFetchData";
const { fetchImage } = useFetchData();
const props = defineProps({
  pet: Object,
});

const emit = defineEmits(["selectPet"]); // Define the event
const selectPet = () => {
  emit("selectPet", props.pet); // Emit the selected pet object
};
</script>

<template>
  <div
    class="hover:cursor-pointer rounded bg-slate-400 w-full max-w-[300px] justify-self-center"
    v-on:click="selectPet()"
  >
    <div class="h-[300px] w-full overflow-hidden bg-slate-200 rounded">
      <img
        :src="fetchImage(props.pet?.imagepath)"
        alt="Pet Image"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="flex flex-col items-center">
      <div class="text-lg font-bold pt-2">{{ props.pet?.name }}</div>
      <div class="text-lg text-center w-3/4 truncate py-2">
        {{ props.pet?.age }}yo | {{ props.pet?.breed }}
      </div>
    </div>
  </div>
</template>
