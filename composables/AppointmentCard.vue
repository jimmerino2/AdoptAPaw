<script setup>
import { useFetchData } from "@/composables/useFetchData";
const { fetchImage } = useFetchData();
const props = defineProps({
  appointment: Object,
  type: String,
});
const client = useSupabaseClient();

const emit = defineEmits(["appointmentChange"]);
const appointmentChange = () => {
  emit("appointmentChange");
};

async function handleRequest(appointment, approval) {
  await client
    .from("appointments")
    .update({ approved: approval })
    .eq("id", appointment.id)
    .select();

  appointmentChange();
}

async function handleRemoval(appointment) {
  await client
    .from("appointments")
    .update({ status: "removed" })
    .eq("id", appointment.id)
    .select();

  appointmentChange();
}
</script>

<template>
  <div
    class="relative rounded-md px-4 py-2 m-4 bg-slate-100 max-w-[350px] border-4 border-slate-400"
  >
    <!-- Status -->
    <div class="absolute top-3 right-3 size-14">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <img
              v-if="props.appointment?.approved === null"
              src="/public/approved_null.png"
            />
            <img
              v-else-if="props.appointment?.approved === true"
              src="/public/approved_t.png"
            />
            <img
              v-else-if="props.appointment?.approved === false"
              src="/public/approved_f.png"
            />
          </TooltipTrigger>
          <TooltipContent>
            <span v-if="props.appointment?.approved === null">Pending</span>
            <span v-else-if="props.appointment?.approved === true"
              >Approved</span
            >
            <span v-else-if="props.appointment?.approved === false"
              >Denied</span
            >
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Image and Name-->
    <div class="flex flex-col items-center p-4">
      <div class="w-[250px] h-[250px] overflow-hidden bg-slate-100 rounded">
        <img
          :src="fetchImage(props.appointment?.pets.imagepath)"
          class="h-full w-full object-cover"
        />
      </div>
      <p class="text-xl font-bold mt-2">{{ props.appointment?.pets.name }}</p>
    </div>

    <!-- Details -->
    <hr class="border-t-black border-dashed" />
    <div class="mb-2">
      <h4 class="mt-2 font-bold">Date</h4>
      <span>{{ props.appointment?.date.substring(0, 10) }} </span>
      <h4 class="mt-2 font-bold">Time</h4>
      <span>{{ props.appointment?.date.substring(11, 16) }}</span>
      <h4 class="mt-2 font-bold">Location</h4>
      <span>{{ props.appointment?.pets.agents.address }}</span>
      <h4 class="mt-2 font-bold">Agent</h4>
      <span>{{ props.appointment?.pets.agents.users.name }}</span>
      <h4 class="mt-2 font-bold">Comment</h4>
      <div
        v-if="props.appointment?.comment"
        class="text-ellipsis overflow-hidden"
      >
        {{ props.appointment?.comment }}
      </div>
      <span v-else>-</span>
    </div>
    <hr class="my-2 border-t-black border-dashed" />

    <!-- Buttons -->
    <div class="flex justify-between w-full">
      <div v-if="props?.type === 'agent'" class="flex justify-around w-full">
        <Button
          @click="handleRequest(props?.appointment, false)"
          variant="destructive"
          >Deny</Button
        >
        <Button @click="handleRequest(props?.appointment, true)">Accept</Button>
      </div>
      <div v-else>
        <Button variant="destructive" @click="handleRemoval(props?.appointment)"
          >Remove</Button
        >
      </div>
    </div>
  </div>
</template>
