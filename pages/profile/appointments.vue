<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useUploadImage } from "@/composables/useUploadImage";
import { useWindowSize } from "@vueuse/core";
definePageMeta({
  middleware: ["auth"],
});

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();

// Appointment Listings
const fetchedAppointments = await fetchData(
  "appointments",
  "date, approved, pets(age, breed, gender, imagepath, name, agents(address, contact, email, name, passno, type, workinghrs))"
);
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
      <h1 class="justify-self-center text-xl font-bold">Appointments</h1>
      <div
        class="justify-items-center"
        :class="{ 'grid grid-cols-2 justify-center w-full': width >= 1440 }"
      >
        <div
          v-for="i in fetchedAppointments"
          class="rounded-md px-4 py-2 m-4 bg-slate-100 w-11/12"
        >
          <div class="flex flex-col items-center p-2">
            <p class="text-xl">{{ i.pets.name }}</p>
            <div
              class="w-[200px] h-[200px] overflow-hidden bg-slate-100 rounded m-2"
            >
              <img
                :src="fetchImage(i.pets.imagepath)"
                class="h-full w-full object-cover"
              />
            </div>
            <span
              :class="{
                'text-green-700': i.approved === true,
                'text-red-700': i.approved === false,
              }"
            >
              <span v-if="i.approved === true">Approved</span>
              <span v-else-if="i.approved === false">Rejected</span>
              <span v-else>Pending</span>
            </span>
          </div>
          <hr class="my-2 border-t-black border-dashed" />
          <div class="mb-2">
            <h4 class="mt-2 font-bold">Date</h4>
            <span>{{ i.date.substring(0, 10) }} </span>
            <h4 class="mt-2 font-bold">Time</h4>
            <span>{{ i.date.substring(11, 16) }}</span>
            <h4 class="mt-2 font-bold">Location</h4>
            <span>{{ i.pets.agents.address }}</span>
            <h4 class="mt-2 font-bold">Agent</h4>
            <span>{{ i.pets.agents.name }}</span>
          </div>
          <hr class="my-2 border-t-black border-dashed" />
        </div>
      </div>
    </div>
  </div>
</template>
