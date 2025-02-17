<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";
const { fetchImage } = useFetchData();
const props = defineProps({
  appointment: Object,
  type: String,
});
const { width } = useWindowSize();
const client = useSupabaseClient();
const emit = defineEmits(["appointmentChange"]);
const appointmentChange = () => {
  emit("appointmentChange");
};

const denialReason = ref();

async function handleRequest(appointment, approval) {
  await client
    .from("appointments")
    .update({ approved: approval })
    .eq("id", appointment.id)
    .select();

  if (!approval) {
    await client
      .from("appointments")
      .update({ reason: denialReason.value })
      .eq("id", appointment.id)
      .select();
  }

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
    class="relative rounded-md px-4 py-2 m-4 bg-beige-300 max-w-[320px] hover:scale-[101%] hover:shadow-xl border-transparent border-2 ease-in duration-100"
  >
    <!-- Status -->
    <div class="absolute top-3 right-6 size-14">
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
      <div
        class="w-[250px] h-[250px] overflow-hidden bg-slate-100 rounded"
        :class="{ 'max-w-48 max-h-48': width < 400 }"
      >
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

      <!-- User View -->
      <div v-if="props?.type !== 'agent'">
        <h4 class="mt-2 font-bold">Location</h4>
        <span>{{ props.appointment?.pets.agents.address }}</span>
        <h4 class="mt-2 font-bold">Agent</h4>
        <span>{{ props.appointment?.pets.agents.users.name }}</span>
      </div>

      <!-- Agent View -->
      <div v-else>
        <h4 class="mt-2 font-bold">Client</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              ><span>{{ props.appointment.users.name }}</span>
            </TooltipTrigger>
            <TooltipContent class="">
              <ProfilePreview :user="props.appointment.users"></ProfilePreview>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h4 class="mt-2 font-bold">Comment</h4>
      <div
        v-if="props.appointment?.comment"
        class="text-ellipsis overflow-hidden"
      >
        {{ props.appointment?.comment }}
      </div>
      <span v-else>-</span>

      <!-- Denial Reason -->
      <div v-if="props.appointment.approved === false">
        <h4 class="mt-2 font-bold">Denial Reason</h4>
        <span>{{ props.appointment.reason }}</span>
      </div>
    </div>
    <hr class="my-2 border-t-black border-dashed" />

    <!-- Buttons -->
    <div class="flex justify-between w-full">
      <div
        v-if="props?.type === 'agent' && props?.appointment.approved == null"
        class="flex justify-around w-full"
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">Deny</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Appointment</AlertDialogTitle>
              <AlertDialogDescription
                >Provide a reason for the denial of this appointment request.

                <input
                  type="text"
                  v-model="denialReason"
                  class="border border-gray-200 w-full p-2 my-2"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                :disabled="!denialReason"
                @click="handleRequest(props?.appointment, false)"
                >Confirm</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          class="bg-emerald-600 hover:bg-emerald-500"
          @click="handleRequest(props?.appointment, true)"
          >Accept</Button
        >
      </div>
      <div
        v-else-if="props?.type !== 'agent'"
        class="w-full flex justify-center"
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">Remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent class="bg-orange-50">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Appointment</AlertDialogTitle>
              <AlertDialogDescription class="text-black"
                >Are you sure you want to remove this appointment?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel
                  class="bg-orange-500 hover:bg-orange-400 text-white"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  @click="handleRemoval(props?.appointment)"
                  class="bg-emerald-500 hover:bg-emerald-400"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
</template>
