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
    "id, date, approved, comment, pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))",
    ["status", "active"]
  )
);

async function refreshData() {
  data.value = await fetchData(
    "appointments",
    "id, date, approved, comment, pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))",
    ["status", "active"]
  );
}
</script>

<template>
  <div
    class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] pt-2 pb-10"
    :class="{ flex: width >= 1024 }"
  >
    <ProfileCard />
    <div
      class="grow rounded-md bg-slate-300"
      :class="{ 'mt-16': width >= 1024 }"
    >
      <div
        class="p-4 flex items-center flex-col w-full h-full bg-slate-100"
        :class="{
          'grid grid-cols-2 justify-center w-full':
            width >= 1440 && width < 1850,
          'grid grid-cols-3 justify-center w-full': width >= 1850,
        }"
      >
        <AppointmentCard
          v-for="items in data"
          :appointment="items"
          :type="'agent'"
          @appointmentChange="refreshData()"
        ></AppointmentCard>
      </div>
    </div>
  </div>
</template>
>
