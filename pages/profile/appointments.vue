<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";
definePageMeta({
  middleware: ["auth", "agentreject"],
});

const { width } = useWindowSize();
const { fetchData } = useFetchData();

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
  <div class="scaling pb-10" :class="{ flex: width >= 1024 }">
    <ProfileCard />
    <div class="grow pb-4 rounded-md" :class="{ 'mt-12': width >= 1024 }">
      <div
        class="justify-items-center w-full"
        :class="{
          'grid grid-cols-2 justify-center': width >= 1440 && width < 1850,
          'grid grid-cols-3 justify-center': width >= 1850,
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
