<script setup>
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";

definePageMeta({
  middleware: ["auth", "agentaccept"],
});
const { width } = useWindowSize();
const { fetchData } = useFetchData();

const data = ref(
  await fetchData(
    "appointments",
    "*, users(*), pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))",
    ["status", "active"]
  )
);

async function refreshData() {
  data.value = await fetchData(
    "appointments",
    "*, users(*), pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))",
    ["status", "active"]
  );
}
</script>

<template>
  <div class="scaling pb-10" :class="{ flex: width >= 1024 }">
    <ProfileCard />
    <div class="grow rounded-md" :class="{ 'mt-12': width >= 1024 }">
      <div
        v-if="data.length > 0"
        class="grid"
        :class="{
          'grid-cols-2 ': width >= 768 && width < 1024,
          'grid-cols-2 ': width > 1300 && width < 1800,
          'grid-cols-3 ': width >= 1800,
        }"
      >
        <AppointmentCard
          v-for="items in data"
          :appointment="items"
          :type="'agent'"
          @appointmentChange="refreshData()"
        ></AppointmentCard>
      </div>
      <div
        v-else
        class="flex items-center justify-center w-full h-full bg-beige-300 mt-4 rounded-lg"
      >
        <div class="flex flex-col">
          <p class="text-xl">No appointments made</p>
        </div>
      </div>
    </div>
  </div>
</template>
>
