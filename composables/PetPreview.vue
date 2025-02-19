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
    class="hover:cursor-pointer w-full rounded-xl max-w-[250px] justify-self-center shadow-lg drop-shadow-xl border-transparent hover:border-orange-100 border-2 hover:shadow-2xl"
    v-on:click="selectPet()"
  >
    <div class="h-[250px] w-full overflow-hidden">
      <img
        :src="fetchImage(props.pet?.imagepath)"
        alt="Pet Image"
        class="h-full w-full object-cover rounded-t-xl"
      />
    </div>

    <div class="flex flex-col items-center bg-beige-200 rounded-b-xl">
      <div class="text-lg font-bold pt-2 w-full text-center bg-orange-300">
        {{ props.pet?.name }}
      </div>

      <div
        class="text-center w-full truncate flex items-center justify-center pt-3"
      >
        <img
          v-show="props.pet?.gender == 'Female'"
          src="/public/gender_f.png"
          class="size-6 mr-1"
        />
        <img
          v-show="props.pet?.gender == 'Male'"
          src="/public/gender_m.png"
          class="size-6 mr-1"
        />
        {{ props.pet?.breed }}
      </div>
      <div class="text-sm py-2">{{ props.pet?.agents?.city }}</div>
    </div>
  </div>
</template>
