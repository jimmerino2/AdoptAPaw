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
  "id, agentid, imagepath, name, agents(*, users(*))",
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

const intervals = 30;
const options = [];

for (let hour = 8; hour < 18; hour++) {
  for (let minutes = 0; minutes < 60; minutes += intervals) {
    const displayHour = hour.toString().padStart(2, "0");
    const displayMinutes = minutes.toString().padStart(2, "0");
    options.push(`${displayHour}:${displayMinutes}`);
  }
}
const filteredOptions = ref(options);
const showDropdown = ref(false);

function filterOptions() {
  filteredOptions.value = options.filter((option) =>
    option.startsWith(formData.value.time)
  );
}

function selectOption(option) {
  formData.value.time = option;
  showDropdown.value = false;
}

function hideDropdown() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100);
}
// #endregion

// #region Form Handling
const errorMsg = ref(null);
const formData = ref({
  date: "",
  time: "",
  comment: "",
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

    // Check if comment is not too long
    if (formData.value.comment.length >= 300) {
      validated.value = false;
      errorMsg.value = "Comment must have less than 300 characters.";
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
          comment: formData.value.comment,
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
  <div
    class="bg-white w-[90%] max-w-[1024px] h-fit flex"
    :class="{ 'flex-col': width < 768 }"
  >
    <!-- Image -->
    <div
      :class="{
        'w-full': width < 768,
        'w-2/5': width >= 768,
      }"
    >
      <img
        :src="fetchImage(petData.imagepath)"
        alt="Pet Image"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Content -->
    <Card class="grow border-none">
      <CardHeader>
        <CardTitle>Schedule for {{ petData.name }}</CardTitle>
      </CardHeader>
      <form @submit.prevent="submitForm">
        <CardContent>
          <!-- Details -->
          <div>
            <p class="font-bold text-xl py-2">Agent Details</p>
            <p class="text-lg pt-2 font-bold">Name</p>
            <p class="text-md">{{ agentData.users.name }}</p>
            <p class="text-lg pt-2 font-bold">Contact</p>
            <p class="text-md">+{{ agentData.users.contact }}</p>
            <div v-if="agentData.type === 'Agent'">
              <p class="text-lg pt-2 font-bold">Email</p>
              <p class="text-md">{{ agentData.users.email }}</p>
            </div>
            <div v-else>
              <p class="text-lg pt-2 font-bold">Working Hours</p>
              <p class="text-md">
                <span v-for="hrs in agentData.workinghrs">
                  {{ hrs }} <br
                /></span>
              </p>
            </div>
          </div>

          <!-- Form -->
          <div class="my-4">
            <!-- Date -->
            <label for="date" class="block text-sm font-medium mt-4"
              >Select Date</label
            >
            <input
              type="date"
              v-model="formData.date"
              :min="minDate"
              :max="maxDate"
              required
              class="mt-1 p-2 border border-gray-300 rounded w-full"
            />

            <!-- Time -->
            <label for="time" class="block text-sm font-medium mt-4"
              >Select Time</label
            >
            <div class="relative mb-4">
              <input
                type="text"
                placeholder="--:-- --"
                v-model="formData.time"
                @focus="showDropdown = true"
                @input="filterOptions"
                @blur="hideDropdown"
                class="mt-1 p-2 border border-gray-300 rounded w-full"
              />
              <ul
                v-if="showDropdown"
                class="absolute top-[100%] border bg-white z-10 w-full border-gray-200 rounded-md max-h-[200px] overflow-y-scroll"
              >
                <li
                  v-for="option in filteredOptions"
                  :key="option"
                  @mousedown.prevent="selectOption(option)"
                  class="p-2 w-full pointer hover:bg-gray-100"
                >
                  {{ option }}
                </li>
              </ul>
            </div>

            <!-- Comment -->
            <label class="text-sm font-medium">Add a Comment</label>
            <textarea
              class="border p-2 border-gray-300 rounded w-full"
              v-model="formData.comment"
            />
            <div class="h-4">
              <p v-if="errorMsg" class="text-red-500 text-sm">
                {{ errorMsg }}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div class="justify-center flex grow">
            <Button as-child class="w-[60%] m-2 max-w-[225px] py-2"
              ><NuxtLink to="/adoption/listings">Back</NuxtLink></Button
            >
            <Button
              type="submit"
              class="w-[60%] m-2 max-w-[225px] py-2 bg-blue-500 text-white hover:bg-blue-600 text-sm"
            >
              Submit
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
