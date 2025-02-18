<script setup>
import { useWindowSize } from "@vueuse/core";
const { fetchData, fetchImage } = useFetchData();
const { width } = useWindowSize();

const route = useRoute();
const toggleContent = ref(false); // 0 - About,  1 - Agent

// #region Query processing
const petId = route.query?.petid;
const agent = route.query?.agent;
// #endregion

// #region Data processing
const fetchedPetDetails = await fetchData(
  "pets",
  "*, medicalrecord(*), agents(*, users(*))",
  ["id", petId]
);
const selectedPet = ref(fetchedPetDetails[0]);
if (!selectedPet.value.addimages) {
  selectedPet.value.addimages = ["", ""];
} else if (!selectedPet.value.addimages[1]) {
  selectedPet.value.addimages[1] = "";
}

const petAgeType = ref(null);
if (selectedPet.age <= 2) {
  if (selectedPet.type === "Cat") {
    petAgeType.value = "Kitten";
  } else {
    petAgeType.value = "Puppy";
  }
} else {
  petAgeType.value = "Adult";
}
// #endregion

// #region Slideshow
const images = ref([
  {
    image: selectedPet.value.addimages[0],
    condition:
      selectedPet.value.addimages[0] !== "" &&
      selectedPet.value.addimages[0] !== undefined,
    id: "image2",
  },
  {
    image: selectedPet.value.imagepath,
    condition: true,
    id: "image1",
  },
  {
    image:
      selectedPet.value.addimages[1] !== "" &&
      selectedPet.value.addimages[0] !== undefined
        ? selectedPet.value.addimages[1]
        : selectedPet.value.addimages[0],
    condition:
      selectedPet.value.addimages[0] !== "" &&
      selectedPet.value.addimages[0] !== undefined,
    id: "image3",
  },
]);

const currentIndex = ref(0);
const previousImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
  updateOpacity();
};

const nextImage = () => {
  currentIndex.value =
    (currentIndex.value - 1 + images.value.length) % images.value.length;
  updateOpacity();
};

const updatedImages = computed(() => {
  const totalImages = images.value.length;
  const index = currentIndex.value;

  return [
    images.value[index],
    images.value[(index + 1) % totalImages],
    images.value[(index + 2) % totalImages],
  ];
});

const updateOpacity = () => {
  updatedImages.value.forEach((image, index) => {
    if (index === 0 || index === 2) {
      image.opacity = 0.2;
    } else {
      image.opacity = 1;
    }
  });
};

onMounted(() => {
  updateOpacity();
});
// #endregion
</script>

<template>
  <div class="h-full flex flex-col items-center scaling">
    <!-- Image Section-->
    <div
      class="w-full flex justify-center bg-black"
      :class="{ 'h-[400px]': width > 576, 'h-[300px]': width <= 576 }"
    >
      <div class="relative flex justify-center overflow-hidden">
        <div class="flex justify-center max-w-[900px] bg-black">
          <img
            v-for="item in updatedImages"
            v-show="item.condition"
            :key="item.id"
            :src="fetchImage(item.image)"
            :id="item.id"
            alt="pet_image"
            class="w-full object-cover max-h-[400px]"
            :style="{ opacity: item.opacity }"
            :class="{
              'min-w-[300px]': width < 576,
              'min-w-[400px]': width >= 576,
            }"
          />
        </div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between h-fit"
          :class="{
            'min-w-[320px]': width < 576,
            'min-w-[420px]': width >= 576,
          }"
          v-show="
            images[0].image !== '' &&
            images[0].image !== undefined &&
            images[2].image !== '' &&
            images[0].image !== undefined
          "
        >
          <img
            src="/left_arrow.png"
            class="size-10 bg-gray-300 p-3 rounded-full hover:cursor-pointer"
            @click="previousImage"
          />
          <img
            src="/right_arrow.png"
            class="size-10 bg-gray-300 p-3 rounded-full hover:cursor-pointer"
            @click="nextImage"
          />
        </div>
      </div>
    </div>

    <!-- Top Section-->
    <div class="w-full">
      <div
        class="flex-col bg-beige-300 w-full flex items-center justify-center py-4"
      >
        <div class="text-[2rem] font-bold">{{ selectedPet.name }}</div>
        <hr class="w-[90%] my-2 border border-gray-400" />
        <div class="py-1 flex text-lg">
          <img
            v-if="selectedPet.gender == 'Female'"
            src="/public/gender_f.png"
            class="size-8 mr-2"
          />
          <img
            v-if="selectedPet.gender == 'Male'"
            src="/public/gender_m.png"
            class="size-8 mr-2"
          />
          {{ selectedPet.breed }}
        </div>
        <div class="py-1 w-full justify-center flex">
          {{ petAgeType }} <span>&nbsp;({{ selectedPet.age }}yo)</span>
        </div>

        <NuxtLink
          :to="{
            path: '/adoption/schedule',
            query: { petId: petId },
          }"
          v-show="!agent"
        >
          <Button class="bg-green-700 hover:bg-green-600 mt-4"
            >Adopt {{ selectedPet.name }}</Button
          >
        </NuxtLink>
      </div>

      <Menubar class="w-full top-14 py-5 z-10" v-show="width <= 768">
        <MenubarMenu>
          <MenubarTrigger
            class="hover:cursor-pointer w-full flex bg-beige-200 justify-center"
            v-on:click="toggleContent = false"
            >About</MenubarTrigger
          >
          <MenubarTrigger
            class="hover:cursor-pointer w-full flex bg-beige-200 justify-center"
            v-on:click="toggleContent = true"
            >Agent or Shelter</MenubarTrigger
          >
        </MenubarMenu>
      </Menubar>
    </div>

    <!-- Details Section -->
    <div class="w-full" :class="{ flex: width > 768 }">
      <!-- Pet Info -->
      <div
        v-show="!toggleContent || width > 768"
        class="py-4 bg-orange-300 w-full p-4"
      >
        <p class="text-2xl font-bold">Pet</p>
        <!-- Description -->
        <p class="pt-2 text-xl font-bold">Description</p>
        <p class="pt-1 text-md">{{ selectedPet.description }}</p>

        <!-- Pet Details -->
        <div class="" :class="{ 'flex mr-10': width > 1210 }">
          <!-- Health and Training -->
          <div class="grow max-w-[400px]">
            <p class="pt-2 text-xl font-bold">Health and Training</p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="
                  selectedPet.medicalrecord?.some(
                    (record) => record.isvaccinated
                  )
                "
                src="/public/vaccination_t.png"
                class="size-8"
              />
              <img v-else src="/public/vaccination_f.png" class="size-8" />
              {{
                ((vaccinationRecord) =>
                  vaccinationRecord
                    ? "Vaccinated on " + vaccinationRecord.vaccinationdate + "."
                    : "Not vaccinated.")(
                  selectedPet.medicalrecord?.reduce((latest, record) => {
                    if (
                      record.isvaccinated &&
                      (!latest ||
                        new Date(record.vaccinationdate) >
                          new Date(latest.vaccinationdate))
                    ) {
                      return record;
                    }
                    return latest;
                  }, null)
                )
              }}
            </p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="
                  selectedPet.medicalrecord?.some((record) => record.isneutered)
                "
                src="/public/neuter_t.png"
                class="size-8"
              />
              <img v-else src="/public/neuter_f.png" class="size-8" />
              {{
                ((neuterRecord) =>
                  neuterRecord
                    ? "Neutered or spayed on " + neuterRecord.neuterdate + "."
                    : "Not Neutered or spayed.")(
                  selectedPet.medicalrecord?.reduce((latest, record) => {
                    if (
                      record.isneutered &&
                      (!latest ||
                        new Date(record.neuterdate) >
                          new Date(latest.neuterdate))
                    ) {
                      return record;
                    }
                    return latest;
                  }, null)
                )
              }}
            </p>
            <p class="pt-1 text-md flex items-center">
              <img
                v-if="selectedPet?.istoilettrained"
                src="/public/toilet_t.png"
                class="size-8"
              />
              <img v-else src="/public/toilet_f.png" class="size-8" />
              This pet is
              <span v-show="!selectedPet.istoilettrained">not</span> toilet
              trained.
            </p>
          </div>

          <!-- Personality -->
          <div class="">
            <p class="pt-2 text-xl font-bold">Personality</p>
            <ul>
              <li
                class="pt-1 text-md capitalize"
                v-for="n in selectedPet.personality"
              >
                {{ n }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Agent Info-->
      <div
        v-show="toggleContent || width > 768"
        class="py-4 bg-orange-300 w-full p-4"
      >
        <p class="text-2xl font-bold">Agent</p>
        <!-- Name -->
        <p class="pt-2 text-xl font-bold">Name</p>
        <p class="pt-1 text-md">{{ selectedPet.agents.users.name }}</p>

        <!-- Address -->
        <p class="pt-2 text-xl font-bold">Address</p>
        <p class="pt-1 text-md">{{ selectedPet.agents.address }}</p>

        <!-- Contact -->
        <p class="pt-2 text-xl font-bold">Contact</p>
        <p class="pt-1 text-md">Email: {{ selectedPet.agents.users.email }}</p>
        <p class="pt-1 text-md">
          Number: +{{ selectedPet.agents.users.contact }}
        </p>

        <div v-show="selectedPet.agents.type == 'Shelter'">
          <p class="pt-2 text-xl font-bold">Working Hours</p>
          <p
            class="pt-1 text-md"
            v-for="hours in selectedPet.agents.workinghrs"
          >
            {{ hours }}
          </p>
        </div>
      </div>
    </div>

    <!-- Fixed Buttons -->
    <Button
      class="hover:cursor-pointer fixed bottom-4 right-4 flex items-center justify-center z-20 bg-yellow-600 hover:bg-yellow-500"
      as-child
    >
      <NuxtLink to="/adoption/listings" v-if="!agent"
        >Back to Listings</NuxtLink
      >
      <NuxtLink to="/agent/posts" v-else>Back to Listings</NuxtLink>
    </Button>
  </div>
</template>
