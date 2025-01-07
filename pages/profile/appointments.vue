<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";
import TooltipContent from "~/components/ui/tooltip/TooltipContent.vue";
definePageMeta({
  middleware: ["auth", "agentreject"],
});

const client = useSupabaseClient();
const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();

// Appointment Listings
const fetchedAppointments = ref();
fetchedAppointments.value = await fetchData(
  "appointments",
  "id, date, approved, comment, pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))"
);

async function deleteRecord(recordId) {
  await client.from("appointments").delete().eq("id", recordId);
  fetchedAppointments.value = await fetchData(
    "appointments",
    "id, date, approved, comment, pets(age, breed, gender, imagepath, name, agents(address, passno, type, workinghrs, users(*)))"
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
        <div
          v-for="i in fetchedAppointments"
          class="relative rounded-md px-4 py-2 m-4 bg-slate-100 w-11/12 max-w-[350px]"
        >
          <!-- Status -->
          <div class="absolute top-3 right-3 size-14">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <img
                    v-if="i.approved === null"
                    src="/public/approved_null.png"
                  />
                  <img
                    v-else-if="i.approved === true"
                    src="/public/approved_t.png"
                  />
                  <img
                    v-else-if="i.approved === false"
                    src="/public/approved_f.png"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <span v-if="i.approved === null">Pending</span>
                  <span v-else-if="i.approved === true">Approved</span>
                  <span v-else-if="i.approved === false">Denied</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <!-- Image and Name-->
          <div class="flex flex-col items-center p-4">
            <div
              class="w-[300px] h-[300px] overflow-hidden bg-slate-100 rounded"
            >
              <img
                :src="fetchImage(i.pets.imagepath)"
                class="h-full w-full object-cover"
              />
            </div>
            <p class="text-xl font-bold mt-4">{{ i.pets.name }}</p>
          </div>

          <!-- Details -->

          <hr class="border-t-black border-dashed" />
          <div class="mb-2">
            <h4 class="mt-2 font-bold">Date</h4>
            <span>{{ i.date.substring(0, 10) }} </span>
            <h4 class="mt-2 font-bold">Time</h4>
            <span>{{ i.date.substring(11, 16) }}</span>
            <h4 class="mt-2 font-bold">Location</h4>
            <span>{{ i.pets.agents.address }}</span>
            <h4 class="mt-2 font-bold">Agent</h4>
            <span>{{ i.pets.agents.users.name }}</span>
            <h4 class="mt-2 font-bold">Comment</h4>
            <div v-if="i.comment" class="text-ellipsis overflow-hidden">
              {{ i.comment }}
            </div>
            <span v-else>-</span>
          </div>
          <hr class="my-2 border-t-black border-dashed" />

          <!-- Buttons -->
          <div class="flex justify-between w-full">
            <Button variant="destructive" @click="deleteRecord(i.id)"
              >Remove</Button
            >
          </div>
        </div>
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
