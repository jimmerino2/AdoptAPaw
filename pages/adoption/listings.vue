<script setup>
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";
import TooltipTrigger from "~/components/ui/tooltip/TooltipTrigger.vue";
const { fetchData } = useFetchData();

const { width } = useWindowSize();

definePageMeta({
  middleware: ["agentreject"],
});

const user = useSupabaseUser();
const pageUser = ref(user.value);
const client = useSupabaseClient();
const route = useRoute();

const petData = ref([]);
const { data } = await client
  .from("pets")
  .select("*, medicalrecord(*), agents(*)")
  .eq("isadopted", false)
  .eq("status", "active");
petData.value = data;

const selectedPet = ref({});
const showDetails = ref(false);

// User data if user is not guest
const fetchedUserData = ref([]);
const userData = ref({
  favorites: [],
});
if (user.value) {
  fetchedUserData.value = await fetchData("users", "*", [
    "user_id",
    user.value.id,
  ]);
  userData.value = fetchedUserData.value[0];
}
if (pageUser.value === null) {
  pageUser.value = false;
}

// Check if accessed from other pages
if (route.query.petid !== undefined && route.query.toggle !== undefined) {
  const fetchedPet = await fetchData("pets", "*", ["id", route.query.petid]);
  selectedPet.value = fetchedPet[0];
  showDetails.value = route.query.toggle;
}

async function updateFavorite(petId) {
  try {
    const fetchedUpdatedUserData = await fetchData("users", "*", [
      "user_id",
      user.value.id,
    ]);
    const updatedUserData = fetchedUpdatedUserData[0];

    if (updatedUserData.favorites.includes(petId)) {
      // Remove the petId from favorites
      const updatedFavorites = updatedUserData.favorites.filter(
        (id) => id !== petId
      );
      await client
        .from("users")
        .update({ favorites: updatedFavorites })
        .eq("id", updatedUserData.id);
    } else {
      // Add the petId to favorites
      const updatedFavorites = [...updatedUserData.favorites, petId];
      await client
        .from("users")
        .update({ favorites: updatedFavorites })
        .eq("id", updatedUserData.id);
    }
    updateUserData();
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

async function updateUserData() {
  fetchedUserData.value = await fetchData("users", "*", [
    "user_id",
    user.value.id,
  ]);
  userData.value = fetchedUserData.value[0];
}

// #region Search and Filtering
const formData = ref({});

// Breeds and Age
const breeds = ref([]);
const age = ref([]);
async function setType() {
  if (formData.value.type) {
    breeds.value = [];
    formData.value.breed = "";
    const data = await fetchData("pets", "*", ["type", formData.value.type]);

    data.forEach((element) => {
      if (!breeds.value.includes(element.breed)) {
        breeds.value.push(element.breed);
      }
    });
    if (formData.value.type == "Dog") {
      age.value = ["Puppy", "Adult"];
    } else {
      age.value = ["Kitten", "Adult"];
    }
  }
}

const filterList = ref([]);
filterList.value = [
  {
    label: "Type",
    model: "type",
    function: setType,
    options: ["Dog", "Cat"],
    disabled: false,
  },
  {
    label: "Breed",
    model: "breed",
    options: computed(() => breeds.value),
    disabled: computed(() => !formData.value.type),
  },
  {
    label: "Age",
    model: "age",
    options: computed(() => age.value),
    disabled: computed(() => !formData.value.type),
  },
  {
    label: "Gender",
    model: "gender",
    options: ["Male", "Female"],
    disabled: false,
  },
  {
    label: "Toilet Trained",
    model: "toilet",
    options: ["Yes", "No"],
    disabled: false,
  },
  {
    label: "Vaccinated",
    model: "vaccine",
    options: ["Yes", "No"],
    disabled: false,
  },
  {
    label: "Spayed or Neutered",
    model: "neuter",
    options: ["Yes", "No"],
    disabled: false,
  },
];

async function submitForm() {
  const { data: agentData } = await client
    .from("agents")
    .select("id")
    .ilike("city", `${formData.value.city}%`);

  const agentIds = agentData.map((agent) => agent.id);

  let query = client
    .from("pets")
    .select("*, agents(*), medicalrecord(*)")
    .eq("isadopted", false)
    .eq("status", "active");

  formData.value.city = formData.value.city || "";
  formData.value.type = formData.value.type || "";
  formData.value.breed = formData.value.breed || "";
  formData.value.gender = formData.value.gender || "";

  query = query
    .ilike("type", `%${formData.value.type}%`)
    .ilike("breed", `%${formData.value.breed}%`)
    .like("gender", `%${formData.value.gender}%`);

  agentIds.length > 0 && query.in("agentid", agentIds);

  // #region Age
  let isChild;
  if (formData.value.age == "Kitten" || formData.value.age == "Puppy") {
    isChild = true;
  } else if (formData.value.age == "Adult") {
    isChild = false;
  }
  if (isChild !== null && isChild !== undefined) {
    query.filter("age", isChild ? "lte" : "gt", 2);
  }
  // #endregion

  // #region Booleans
  const [isToiletTrained, isVaccinated, isNeutered] = [ref(), ref(), ref()];
  const booleans = [isToiletTrained, isVaccinated, isNeutered];
  const formDatas = [
    formData.value.toilet,
    formData.value.vaccine,
    formData.value.neuter,
  ];

  function assignBoolean(booleans, formDatas) {
    formDatas.forEach((value, index) => {
      if (value === "Yes") {
        booleans[index].value = true;
      } else if (value === "No") {
        booleans[index].value = false;
      }
    });
  }
  assignBoolean(booleans, formDatas);

  if (booleans[0].value !== null && booleans[0].value !== undefined) {
    query.filter("istoilettrained", "eq", booleans[0].value);
  }
  // #endregion

  // #region Medical Records
  const { data } = await query;
  const filteredData = data.filter((pet) => {
    const isVaccinatedMatch =
      booleans[1].value === null ||
      booleans[1].value === undefined ||
      (booleans[1].value
        ? pet.medicalrecord?.some((record) => record.isvaccinated === true)
        : pet.medicalrecord?.every((record) => record.isvaccinated === false));

    const isNeuteredMatch =
      booleans[2].value === null ||
      booleans[2].value === undefined ||
      (booleans[2].value
        ? pet.medicalrecord?.some((record) => record.isneutered === true)
        : pet.medicalrecord?.every((record) => record.isneutered === false));

    return isVaccinatedMatch && isNeuteredMatch;
  });

  petData.value = filteredData;
}

async function resetForm() {
  formData.value.city = "";
  formData.value.type = "";
  formData.value.breed = "";
  formData.value.gender = "";
  formData.value.age = "";
  formData.value.toilet = "";
  formData.value.vaccine = "";
  formData.value.neuter = "";
}
// #endregion
</script>

<template>
  <!-- Pet Preview -->
  <div class="flex flex-col items-center scaling">
    <!-- Title -->
    <div class="flex flex-col items-center mt-12">
      <p class="text-4xl font-bold text-orange-700">Find a Pet</p>
      <p class="text-lg text-center text-orange-700">
        Browse through our listings to find a suitable pet for adoption!
      </p>
    </div>

    <!-- Search and Filter -->
    <div class="w-full my-8 flex bg-red">
      <input
        type="text"
        v-model="formData.city"
        placeholder="Search City"
        class="p-2 w-full grow border rounded-lg border-orange-200"
        @input="submitForm"
      />
      <Sheet>
        <SheetTrigger as-child>
          <Button class="ml-4 bg-orange-700 hover:bg-orange-600">Filter</Button>
        </SheetTrigger>
        <SheetContent class="bg-beige-200 overflow-scroll">
          <SheetHeader>
            <SheetTitle>Filter Options</SheetTitle>
            <SheetDescription class="text-orange-900 opacity-70"
              >Find the pet that suits you best</SheetDescription
            >
          </SheetHeader>
          <form @submit.prevent="submitForm()">
            <div v-for="(i, index) in filterList" :key="index" class="my-4">
              <p class="text-lg py-2">{{ i.label }}</p>
              <select
                class="w-full p-2"
                v-model="formData[i.model]"
                @change="i.function"
                :disabled="i.disabled"
              >
                <option v-for="option in i.options" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
            <SheetFooter>
              <div class="flex w-full justify-around">
                <Button
                  class="bg-amber-500 px-7 hover:bg-amber-400"
                  @click="resetForm()"
                  >Clear</Button
                >
                <Button
                  type="submit"
                  class="bg-emerald-600 px-7 hover:bg-emerald-500"
                  >Filter</Button
                >
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Listings -->
    <div
      v-if="petData.length > 0"
      class="w-full grid gap-6 px-2 mb-10"
      :class="{
        'grid-cols-5': width >= 1700,
        'grid-cols-4': width >= 1400,
        'grid-cols-3': width >= 1024,
        'grid-cols-2': width >= 576,
        'grid-cols-1': width < 576,
      }"
    >
      <div
        v-for="pet in petData"
        :key="pet._id"
        class="w-full flex justify-center"
      >
        <div class="max-w-[250px] relative w-full z-20">
          <!-- Favorite Icon -->
          <div
            class="absolute top-3 right-3 max-w-12 z-20"
            @click="updateFavorite(pet.id)"
            v-show="pageUser"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <img
                    v-if="userData.favorites.includes(pet.id)"
                    src="/public/fav_filled.png"
                  />
                  <img v-else src="/public/fav_empty.png" />
                </TooltipTrigger>
                <TooltipContent v-if="userData.favorites.includes(pet.id)"
                  >Remove From Favorites</TooltipContent
                >
                <TooltipContent v-else>Add to Favorites</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <!-- Pet Preview -->
          <NuxtLink
            :to="{
              path: '/adoption/details',
              query: {
                petid: pet.id,
              },
            }"
          >
            <PetPreview :pet="pet" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="text-xl">No results found</div>
  </div>

  <!-- Appointments -->
  <div class="fixed bottom-4 right-4 z-40" v-show="!showDetails && pageUser">
    <NuxtLink to="/profile/appointments">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            ><Avatar
              class="size-20 p-3 bg-amber-500 transform hover:scale-105 transition ease-in duration-100 hover:bg-amber-400"
            >
              <AvatarImage src="/appointments_icon.png" />
              <AvatarFallback>Appointments</AvatarFallback>
            </Avatar></TooltipTrigger
          >
          <TooltipContent>To Appointments</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </NuxtLink>
  </div>
</template>
