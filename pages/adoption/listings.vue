<script setup>
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";
const { fetchData, fetchImage } = useFetchData();

const { width } = useWindowSize();

definePageMeta({
  middleware: ["agentreject"],
});

const user = useSupabaseUser();
const pageUser = ref(user.value);
const client = useSupabaseClient();
const route = useRoute();

const petData = ref([]);
petData.value = await fetchData("pets", "*, medicalrecord(*)", [
  "isadopted",
  false,
]);

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
// #endregion

// #region Search and Filtering
const formData = ref({});

// Name
async function searchName() {
  if (formData.value.name) {
    const { data } = await client
      .from("pets")
      .select("*")
      .ilike("name", "%" + formData.value.name + "%");
    petData.value = data;
  } else {
    petData.value = await fetchData("pets");
  }
}

// Breeds and Age
const breeds = ref([]);
const age = ref([]);
async function setType() {
  if (formData.value.type) {
    breeds.value = [];
    formData.value.breed = "";
    const data = await fetchData("pets", "*", ["type", formData.value.type]);

    data.forEach((element) => {
      breeds.value.push(element.breed);
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
  formData.value.name = formData.value.name || "";
  formData.value.type = formData.value.type || "";
  formData.value.breed = formData.value.breed || "";
  formData.value.gender = formData.value.gender || "";

  const query = client
    .from("pets")
    .select("*, medicalrecord(*)")
    .ilike("name", "%" + formData.value.name + "%")
    .like("type", "%" + formData.value.type + "%")
    .like("breed", "%" + formData.value.breed + "%")
    .like("gender", "%" + formData.value.gender + "%")
    .eq("isadopted", false);

  // Age
  let isChild;
  if (formData.value.age == "Kitten" || formData.value.age == "Puppy") {
    isChild = true;
  } else if (formData.value.age == "Adult") {
    isChild = false;
  }
  if (isChild !== null && isChild !== undefined) {
    query.filter("age", isChild ? "gt" : "lte", 2);
  }

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

  const { data } = await query;
  const filteredPets = data.filter((pet) => {
    // Vaccinated
    const isVaccinatedMatch =
      booleans[1].value === null ||
      booleans[1].value === undefined ||
      (booleans[1].value === true
        ? pet.medicalrecord?.some((record) => record.isvaccinated === true)
        : !pet.medicalrecord ||
          pet.medicalrecord.every((record) => record.isvaccinated === false));

    // Neutered
    const isNeuteredMatch =
      booleans[2].value === null ||
      booleans[2].value === undefined ||
      (booleans[2].value == true
        ? pet.medicalrecord?.some((record) => record.isneutered === true)
        : !pet.medicalrecord ||
          pet.medicalrecord.every((record) => record.isneutered === false));
    return isVaccinatedMatch && isNeuteredMatch;
  });
  petData.value = filteredPets;
}

async function resetForm() {
  formData.value.name = "";
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
  <div
    class="h-fit py-4 flex flex-col items-center bg-slate-200 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
  >
    <!-- Title -->
    <div class="mx-2 px-2 flex flex-col items-center">
      <p class="text-[2.5rem]">Find a Pet</p>
      <p class="text-lg text-center py-2">
        Browse through our listings to find a suitable pet for adoption!
      </p>
    </div>

    <!-- Search and Filter -->
    <div class="w-full my-6 p-2 max-w-[1300px] flex">
      <input
        type="text"
        v-model="formData.name"
        placeholder="Pet Name"
        class="p-2 w-full grow"
        @input="searchName"
      />
      <Sheet>
        <SheetTrigger as-child>
          <Button class="ml-4">Filter</Button>
        </SheetTrigger>
        <SheetContent class="bg-slate-100 overflow-scroll">
          <SheetHeader>
            <SheetTitle>Filter Options</SheetTitle>
            <SheetDescription
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
              <div class="flex justify-around">
                <Button class="mx-8 px-8 bg-slate-200 grow" @click="resetForm()"
                  >Clear</Button
                >
                <Button type="submit" class="mx-8 px-8 bg-slate-300 grow"
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
      class="w-full grid gap-6 px-2 max-w-[1200px]"
      :class="{
        'grid-cols-4': width >= 1500,
        'grid-cols-3': width >= 1000,
        'grid-cols-2': width < 1000 && width >= 576,
        'grid-cols-1': width < 576,
      }"
    >
      <div
        v-for="pet in petData"
        :key="pet._id"
        class="w-full flex justify-center"
      >
        <div class="max-w-[300px] relative w-full">
          <!-- Favorite Icon -->
          <div
            class="absolute top-2 right-2 max-w-12"
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
  </div>

  <!-- Appointments -->
  <div
    class="fixed bottom-[32px] right-[10px]"
    v-show="!showDetails && pageUser"
  >
    <NuxtLink to="/profile/appointments">
      <Avatar class="size-20 p-3 bg-slate-400">
        <AvatarImage src="/appointments_icon.png" />
        <AvatarFallback>Appointments</AvatarFallback>
      </Avatar>
    </NuxtLink>
  </div>
</template>
