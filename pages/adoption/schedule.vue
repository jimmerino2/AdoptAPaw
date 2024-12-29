<script setup>
import { useRoute } from "vue-router";
import { useFetchData } from "@/composables/useFetchData";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  middleware: ["adoption", "auth"],
  layout: "forms",
});

const { fetchImage, fetchData } = useFetchData();
const { width } = useWindowSize();
const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();

// #region Data Fetching
const petId = route.query.petId;
const fetchedAppointmentData = await fetchData("appointments", "pets(id)", [
  "petid",
  petId,
]);

const fetchedPetData = await fetchData(
  "pets",
  "id, agentid, imagepath, name, agents(*)",
  ["id", petId]
);

const fetchedUserData = await fetchData("users", "id", [
  "user_id",
  user.value.id,
]);

const userId = fetchedUserData[0].id;
const petData = fetchedPetData[0];
const agentData = fetchedPetData[0].agents;

const convertTime = (string) => {
  const minHr = string.split("-")[0];
  const maxHr = string.split("-")[1];

  function conv(hr) {
    if (hr.includes("PM")) {
      if (hr !== "12") {
        return parseInt(hr.split(" ")[1]) + 12;
      }
      return 12;
    } else if (hr === "12 AM") {
      return 0;
    } else {
      return parseInt(hr.split(" ")[1]);
    }
  }

  const convertedMinHr = conv(minHr);
  const convertedMaxHr = conv(maxHr);
  return [convertedMinHr, convertedMaxHr];
};
const workingHrs = ref([]);

// Get Working Hours if shelter
if (agentData.type === "Shelter") {
  agentData.workinghrs.forEach((item) => {
    // If weekdays
    if (item.split(":")[0] == "Weekdays") {
      const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const time = convertTime(item.split(":")[1]);

      weekdays.forEach((day) => {
        workingHrs.value.push({ day: day, min: time[0], max: time[1] });
      });
    } else {
      const time = convertTime(item.split(":")[1]);
      workingHrs.value.push({
        day: item.split(":")[0],
        min: time[0],
        max: time[1],
      });
    }
  });
}
// #endregion

// #region Form Input
const today = new Date();
function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

let minDate = addDays(today, 3).toISOString().slice(0, 10);
let maxDate = addDays(today, 25).toISOString().slice(0, 10);

const inputList = ref([
  {
    label: "Select Date",
    type: "date",
    model: "date",
    min: minDate,
    max: maxDate,
    condition: true,
  },
  {
    label: "Select Time",
    id: "time",
    type: "time",
    model: "time",
    condition: true,
    step: 900,
  },
]);
// #endregion

// #region Form Handling
const errorMsg = ref(null);
const formData = ref({
  date: "",
  time: "",
});

async function submitForm() {
  try {
    const validated = ref(true);
    let inputDate = formData.value.date;
    inputDate = new Date(inputDate);
    minDate = new Date(minDate);
    maxDate = new Date(maxDate);
    let inputTime = formData.value.time;

    // Check if date is out of range
    if (
      !(
        inputDate.getTime() >= minDate.getTime() &&
        inputDate.getTime() <= maxDate.getTime()
      )
    ) {
      errorMsg.value = "Date did not meet the acceptable range.";
      validated.value = false;
    }

    // Check if appointment exists
    if (fetchedAppointmentData[0] !== undefined) {
      errorMsg.value = "An appointment has already been scheduled.";
      validated.value = false;
    }

    // Check if date fits shelter schedule
    if (agentData.type == "Shelter") {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = daysOfWeek[inputDate.getDay()];
      const [hours, minutes] = inputTime.split(":");
      const testTime = parseInt(hours) + parseInt(minutes) / 60;
      validated.value = false;

      workingHrs.value.forEach((item) => {
        if (
          item.day == dayName &&
          testTime >= item.min &&
          testTime <= item.max
        ) {
          validated.value = true;
        }
      });
      if (!validated.value) {
        errorMsg.value = "Shelter is not available at that time or day.";
      }
    }

    // Run if validated
    if (validated.value) {
      const newDate = new Date(inputDate).toISOString().slice(0, 10);
      const newTime = inputTime + ":00";
      const datetime = newDate + " " + newTime;
      const { error } = await client.from("appointments").insert([
        {
          petid: petData.id,
          userid: userId,
          date: datetime,
        },
      ]);
      if (error) throw error;
      router.push("/homepage");
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
}
// #endregion
</script>

<template>
  <Card class="w-[90%] max-w-[768px] h-fit">
    <CardHeader>
      <CardTitle class="text-center">Schedule Appointment</CardTitle>
    </CardHeader>

    <form @submit.prevent="submitForm">
      <CardContent class="justify-self-center grow w-[90%]">
        <!-- #region Pet and Shelter Details -->
        <div class="w-full" :class="{ 'flex flex-row h-fit': width >= 650 }">
          <div class="bg-zinc-300 flex flex-col items-center">
            <div
              class="w-[200px] h-[200px] w-full overflow-hidden bg-slate-200 rounded"
            >
              <img
                :src="fetchImage(petData.imagepath)"
                alt="Pet Image"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="p-2 text-center text-xl bg-zinc-100 w-full">
              <span>{{ petData.name }}</span>
            </div>
          </div>
          <div class="p-4 bg-slate-200 w-full">
            <p class="text-center text-lg py-2 font-bold">Agent Details</p>
            <p class="py-2">Name: {{ agentData.name }}</p>
            <p class="py-2">Contact: {{ agentData.contact }}</p>
            <p v-if="agentData.type === 'Agent'" class="py-2">
              Email: {{ agentData.email }}
            </p>
            <p v-else class="py-2">
              Working Hours: <br />
              <span v-for="hrs in agentData.workinghrs"> {{ hrs }} <br /></span>
            </p>
          </div>
        </div>
        <!-- #endregion-->

        <!-- #region Form Section -->
        <div class="w-4/5 justify-self-center">
          <div v-for="item in inputList" :key="item.id" class="my-4">
            <label :for="item.id" class="block text-sm font-medium">
              {{ item.label }}
            </label>
            <input
              v-model="formData[item.model]"
              :type="item.type"
              :id="item.id"
              :placeholder="item.placeholder"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :disabled="!item.condition"
              class="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <p v-if="errorMsg" class="text-red-500 text-sm mb-4 grow">
            {{ errorMsg }}
          </p>
        </div>
        <!-- #endregion -->
      </CardContent>

      <CardFooter class="w-full inline-block">
        <div
          class="justify-center flex grow"
          :class="{ 'flex-col items-center': width <= 576 }"
        >
          <Button as-child class="w-[60%] m-2 max-w-[225px] py-2"
            ><NuxtLink to="/adoption/listings">Back</NuxtLink></Button
          >
          <button
            type="submit"
            class="w-[60%] m-2 max-w-[225px] py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Make Appoinment
          </button>
        </div>
      </CardFooter>
    </form>
  </Card>
</template>
