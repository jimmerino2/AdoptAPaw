<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";
import TooltipContent from "~/components/ui/tooltip/TooltipContent.vue";
definePageMeta({
  middleware: ["auth", "agentreject"],
});

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();

// Appointment Listings
const fetchedAppointments = ref(
  await fetchData(
    "appointments",
    "id, date, approved, comment, pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))"
  )
);

async function refreshData() {
  fetchedAppointments.value = await fetchData(
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
      class="grow p-4 rounded-md bg-slate-300"
      :class="{ 'mt-16': width >= 1024 }"
    >
      <h1 class="justify-self-center text-2xl px-4 font-bold">Appointments</h1>
      <div
        class="justify-items-center"
        :class="{
          'grid grid-cols-2 justify-center w-full':
            width >= 1440 && width < 1850,
          'grid grid-cols-3 justify-center w-full': width >= 1850,
        }"
        v-if="fetchedAppointments.length !== 0"
      >
        <!-- Appointment Card -->
        <AppointmentCard
          v-for="i in fetchedAppointments"
          :appointment="i"
          @appointmentChange="refreshData()"
        ></AppointmentCard>
      </div>
      <div v-else class="flex items-center justify-center w-full h-full">
        <div class="flex flex-col">
          <p class="text-xl">No appointments made</p>
          <NuxtLink to="/adoption/listings">
            <Button class="m-8">Find Pet Listings</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
