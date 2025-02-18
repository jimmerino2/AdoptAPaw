<script setup>
import { useWindowSize } from "@vueuse/core";
import { useUploadImage } from "#imports";
import { useFetchData } from "@/composables/useFetchData";
import { usePetFormValidation } from "~/composables/usePetFormValidation";

definePageMeta({
  middleware: ["auth", "agentaccept"],
  layout: "forms",
});

const {
  valName,
  valType,
  valBreed,
  valGender,
  valAge,
  valWeight,
  valPrice,
  valBooleanSelect,
  valDesc,
  valPersonality,
  valMedicalDate,
} = usePetFormValidation();
const { width } = useWindowSize();
const { uploadImage } = useUploadImage();
const { fetchData, fetchImage } = useFetchData();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const route = useRoute();

// #region Form Input
const formData = ref({
  personality: [],
});
const inputList = [
  [
    {
      type: "text",
      label: "Name",
      placeholder: "Enter pet name",
      id: "name",
    },
    {
      type: "select",
      label: "Type",
      id: "type",
      values: ["Dog", "Cat"],
    },
    {
      type: "text",
      label: "Breed",
      placeholder: "Enter pet breed",
      id: "breed",
    },
    {
      type: "select",
      label: "Gender",
      id: "gender",
      values: ["Male", "Female"],
    },
    {
      type: "number",
      label: "Age (years)",
      placeholder: "Enter pet age",
      id: "age",
      step: "0.5",
    },
    {
      type: "number",
      label: "Weight (kg)",
      placeholder: "Enter pet weight",
      id: "weight",
      step: "0.02",
    },
    {
      type: "number",
      label: "Price (RM)",
      placeholder: "Enter adoption price",
      id: "price",
      step: "0.01",
    },
    {
      type: "select",
      label: "Toilet Trained",
      id: "toilet",
      values: ["Yes", "No"],
    },
    {
      type: "checkbox",
      label: "Personality (Up to 3)",
      id: "personality",
      values: [
        "affectionate",
        "curious",
        "energetic",
        "friendly",
        "gentle",
        "lazy",
        "loyal",
        "playful",
        "protective",
        "relaxed",
        "strong",
      ],
    },
    {
      type: "textarea",
      label: "Description ",
      placeholder: "Let people know more about the story of your pet.",
      id: "desc",
    },
  ],
  [
    {
      legend: "Vaccination",
      items: [
        {
          type: "select",
          label: "Vaccinated",
          id: "vaccine",
          values: ["Yes", "No"],
        },
        {
          type: "date",
          label: "Latest Vaccination Date (Skip if not vaccinated)",
          id: "vaccDate",
          max: new Date().toISOString().split("T")[0],
        },
      ],
    },
    {
      legend: "Birth Control",
      items: [
        {
          type: "select",
          label: "Neutered or Spayed",
          id: "neuter",
          values: ["Yes", "No"],
        },
        {
          type: "date",
          label: "Neuter Date (Skip if not neutered)",
          id: "neuterDate",
          max: new Date().toISOString().split("T")[0],
        },
      ],
    },
    {
      type: "textarea",
      label: "Special Condition(s)",
      id: "condition",
      placeholder: "Enter any special conditions the pet may have",
    },
  ],
];

// Photo
const selectedImagePrimary = ref(null);
const selectedImageSecondary = ref(null);
const selectedImageThird = ref(null);
const handleFileChange = (imageKey, event) => {
  const file = event.target.files[0];
  if (file) {
    if (imageKey === "primary") {
      selectedImagePrimary.value = file;
    } else if (imageKey === "secondary") {
      selectedImageSecondary.value = file;
    } else {
      selectedImageThird.value = file;
    }
  }
};

const createObjectURL = (file) => URL.createObjectURL(file);

const isImageUrl = (url) => {
  const urlRegex =
    /^(https?:\/\/)?[^\s(["<,>]*\.(?:jpg|jpeg|png|gif|bmp|webp)(?:[^\s]*)$/i;
  return urlRegex.test(url);
};

const isImageFile = (file) => {
  if (file instanceof Blob) {
    return file.type.startsWith("image/");
  }
  return false;
};

const imageInputList = ref([
  {
    key: "primary",
    label: "Primary Photo",
    selectedImage: computed(() => {
      return selectedImagePrimary.value;
    }),
    image: computed(() => {
      const selectedImage = selectedImagePrimary.value;
      if (!selectedImage) return "/transparent.png";
      if (typeof selectedImage === "string" && isImageUrl(selectedImage)) {
        return selectedImage;
      } else if (selectedImage instanceof Blob && isImageFile(selectedImage)) {
        return createObjectURL(selectedImage);
      }
      return null;
    }),
    desc: "This photo will be shown in pet listings and the photo seen when users view your listing.",
  },
  {
    key: "secondary",
    section: true,
    label: "Secondary Photo",
    selectedImage: computed(() => {
      return selectedImageSecondary.value;
    }),
    image: computed(() => {
      const selectedImage = selectedImageSecondary.value;
      if (!selectedImage) return "/transparent.png";
      if (typeof selectedImage === "string" && isImageUrl(selectedImage)) {
        return selectedImage;
      } else if (selectedImage instanceof Blob && isImageFile(selectedImage)) {
        return createObjectURL(selectedImage);
      }
      return null;
    }),
    desc: "Extra photos if may.",
  },
  {
    key: "third",
    section: true,
    label: "Final Photo",
    selectedImage: computed(() => {
      return selectedImageThird.value;
    }),
    image: computed(() => {
      const selectedImage = selectedImageThird.value;
      if (!selectedImage) return "/transparent.png";
      if (typeof selectedImage === "string" && isImageUrl(selectedImage)) {
        return selectedImage;
      } else if (selectedImage instanceof Blob && isImageFile(selectedImage)) {
        return createObjectURL(selectedImage);
      }
      return null;
    }),
    desc: "Extra photos if may.",
  },
]);
// #endregion

// #region Query Management
function convBoolean(value) {
  if (value === "Yes" || value === "No") return value === "Yes" ? true : false;
  else if (value === true || value === false)
    return value === true ? "Yes" : "No";
}

if (route.query.petid && route.query.agentid) {
  const petDetails = await fetchData("pets", "*, medicalrecord(*)", [
    "id",
    route.query.petid,
  ]);

  if ((route.query.agentid = petDetails[0].agentid)) {
    formData.value.name = petDetails[0].name;
    formData.value.type = petDetails[0].type;
    formData.value.breed = petDetails[0].breed;
    formData.value.gender = petDetails[0].gender;
    formData.value.age = petDetails[0].age;
    formData.value.weight = petDetails[0].weight;
    formData.value.price = petDetails[0].listedprice;
    formData.value.toilet = convBoolean(petDetails[0].istoilettrained); // Test
    formData.value.personality = petDetails[0].personality;
    formData.value.desc = petDetails[0].description;

    formData.value.vaccine =
      petDetails[0].medicalrecord[0]?.isvaccinated === undefined
        ? null
        : convBoolean(petDetails[0].medicalrecord[0].isvaccinated);

    formData.value.vaccDate =
      petDetails[0].medicalrecord[0]?.vaccinationdate === undefined
        ? null
        : petDetails[0].medicalrecord[0].vaccinationdate;

    formData.value.neuter =
      petDetails[0].medicalrecord[0]?.isneutered === undefined
        ? null
        : convBoolean(petDetails[0].medicalrecord[0].isneutered);

    formData.value.neuterDate =
      petDetails[0].medicalrecord[0]?.vaccinationdate === undefined
        ? null
        : petDetails[0].medicalrecord[0].neuterdate;

    formData.value.condition =
      petDetails[0].medicalrecord[0]?.specialcondition === undefined
        ? null
        : petDetails[0].medicalrecord[0].specialcondition;

    selectedImagePrimary.value = fetchImage(petDetails[0].imagepath);
    if (petDetails[0].addimages !== null) {
      petDetails[0].addimages[0]
        ? (selectedImageSecondary.value = fetchImage(
            petDetails[0].addimages[0]
          ))
        : "";
      petDetails[0].addimages[1]
        ? (selectedImageThird.value = fetchImage(petDetails[0].addimages[1]))
        : "";
    }
  }
}
// #endregion

// #region Form Val
const errorMsg = ref("");
const successMsg = ref("");
const verified = ref(true);

async function submitForm() {
  verified.value = true;
  errorMsg.value = "";
  // #region Check if forms are filled
  const basicDetails = [
    "name",
    "type",
    "breed",
    "gender",
    "weight",
    "price",
    "toilet",
    "personality",
    "desc",
  ];

  if (
    basicDetails.some(
      (attr) =>
        formData.value[attr] === undefined ||
        formData.value[attr] === "" ||
        (Array.isArray(formData.value[attr]) &&
          formData.value[attr].length === 0)
    )
  ) {
    verified.value = false;
    errorMsg.value = "Basic details not filled.";
  } else if (
    formData.value.vaccine === undefined ||
    formData.value.neuter === undefined
  ) {
    verified.value = false;
    errorMsg.value = "Medical details not filled.";
  } else if (formData.value.vaccine === "Yes") {
    if (formData.value.vaccDate === undefined) {
      verified.value = false;
      errorMsg.value = "Medical details not filled.";
    }
  } else if (formData.value.neuter === "Yes") {
    if (formData.value.neuterDate === undefined) {
      verified.value = false;
      errorMsg.value = "Medical details not filled.";
    }
  } else if (
    !(
      selectedImagePrimary.value &&
      isImageFile(
        selectedImagePrimary.value ||
          isImageUrl(selectedImagePrimary.value) ||
          isImageFile(selectedImagePrimary.value)
      )
    )
  ) {
    verified.value = false;
    errorMsg.value = "Primary image not filled.";
  } else if (
    (selectedImageSecondary.value &&
      !(
        isImageFile(selectedImageSecondary.value) ||
        isImageUrl(selectedImageSecondary)
      )) ||
    (selectedImageThird.value &&
      (!isImageFile(selectedImageThird.value) ||
        isImageUrl(selectedImageThird.value)))
  ) {
    verified.value = false;
    errorMsg.value = "Invalid image format.";
  }
  // #endregion

  // #region Check input format
  if (verified.value) {
    if (!valName(formData.value.name)) {
      verified.value = false;
      errorMsg.value = "Invalid pet name entered.";
    } else if (!valType(formData.value.type)) {
      verified.value = false;
      errorMsg.value = "Invalid pet type entered.";
    } else if (!valBreed(formData.value.breed)) {
      verified.value = false;
      errorMsg.value = "Invalid pet breed entered.";
    } else if (!valGender(formData.value.gender)) {
      verified.value = false;
      errorMsg.value = "Invalid pet gender entered.";
    } else if (!valAge(formData.value.age)) {
      verified.value = false;
      errorMsg.value = "nvalid pet age entered.";
    } else if (!valWeight(formData.value.weight)) {
      verified.value = false;
      errorMsg.value = "Invalid pet weight entered.";
    } else if (!valPrice(formData.value.price)) {
      verified.value = false;
      errorMsg.value = "Invalid price entered.";
    } else if (!valDesc(formData.value.desc)) {
      verified.value = false;
      errorMsg.value = "Invalid pet description entered.";
    } else if (!valBooleanSelect(formData.value.toilet)) {
      verified.value = false;
      errorMsg.value = "Invalid toilet trained option entered.";
    } else if (!valPersonality(formData.value.personality)) {
      verified.value = false;
      errorMsg.value = "Invalid personality selection entered.";
    } else if (!valBooleanSelect(formData.value.vaccine)) {
      verified.value = false;
      errorMsg.value = "Invalid vaccination option entered.";
    } else if (
      !valMedicalDate(formData.value.vaccDate) &&
      formData.value.vaccine === "Yes"
    ) {
      verified.value = false;
      errorMsg.value = "Invalid vaccination date entered.";
    } else if (!valBooleanSelect(formData.value.neuter)) {
      verified.value = false;
      errorMsg.value = "Invalid neuter option entered.";
    } else if (
      !valMedicalDate(formData.value.neuterDate) &&
      formData.value.neuter === "Yes"
    ) {
      verified.value = false;
      errorMsg.value = "Invalid neuter date entered.";
    } else if (
      formData.value.condition === undefined ||
      formData.value.condition === null
    ) {
      if (!valDesc(formData.value.condition)) {
        verified.value = false;
        errorMsg.value = "Invalid format for special condition entered";
      }
    }
  }
  // #endregion

  // #region Submission

  if (verified.value) {
    const userData = await fetchData("users", "id", ["user_id", user.value.id]);
    const agentData = await fetchData("agents", "id", ["uid", userData[0].id]);
    const breed = formData.value.breed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (route.query.edit && route.query.edit === "true") {
      await client
        .from("pets")
        .update({
          name: formData.value.name,
          age: formData.value.age,
          type: formData.value.type,
          weight: formData.value.weight,
          description: formData.value.desc,
          gender: formData.value.gender,
          personality: formData.value.personality,
          istoilettrained: convBoolean(formData.value.toilet),
          listedprice: formData.value.price,
          breed: breed,
        })
        .eq("id", route.query.petid);

      await client
        .from("medicalrecord")
        .update({
          isneutered: convBoolean(formData.value.neuter),
          isvaccinated: convBoolean(formData.value.vaccine),
          neuterdate: formData.value.neuterDate
            ? formData.value.neuterDate
            : "",
          vaccinationdate: formData.value.vaccDate
            ? formData.value.vaccDate
            : "",
          specialcondition: formData.value.condition
            ? formData.value.condition
            : "",
        })
        .eq("petid", route.query.petid);

      // Image
      await client
        .from("pets")
        .update({
          imagepath: await uploadImage(
            "pets",
            selectedImagePrimary.value,
            route.query.petid,
            "pets",
            true
          ),
        })
        .eq("id", route.query.petid);

      const filepaths = [];

      if (selectedImageSecondary.value) {
        filepaths.push(
          await uploadImage(
            "pets_secondary",
            selectedImageSecondary.value,
            route.query.petid,
            "pets",
            false
          )
        );
      }

      if (selectedImageThird.value) {
        filepaths.push(
          await uploadImage(
            "pets_third",
            selectedImageThird.value,
            route.query.petid,
            "pets",
            false
          )
        );
      }

      await client
        .from("pets")
        .update({
          addimages: filepaths,
        })
        .eq("id", route.query.petid);
    } else {
      const { data } = await client
        .from("pets")
        .insert([
          {
            name: formData.value.name,
            age: formData.value.age,
            type: formData.value.type,
            weight: formData.value.weight,
            description: formData.value.desc,
            gender: formData.value.gender,
            personality: formData.value.personality,
            isadopted: false,
            istoilettrained: convBoolean(formData.value.toilet),
            listedprice: formData.value.price,
            breed: breed,
            imagepath: "",
            agentid: agentData[0].id,
          },
        ])
        .select();

      const { error } = await client.from("medicalrecord").insert([
        {
          isneutered: convBoolean(formData.value.neuter),
          isvaccinated: convBoolean(formData.value.vaccine),
          neuterdate: formData.value.neuterDate
            ? formData.value.neuterDate
            : null,
          vaccinationdate: formData.value.vaccDate
            ? formData.value.vaccDate
            : null,
          petid: data[0].id, // Ensure data[0].id exists in the pets table
          specialcondition: formData.value.condition
            ? formData.value.condition
            : null,
        },
      ]);
      if (error) console.error("Insert failed:", error);

      // Image
      await client
        .from("pets")
        .update({
          imagepath: await uploadImage(
            "pets",
            selectedImagePrimary.value,
            data[0].id,
            "pets"
          ),
        })
        .eq("id", data[0].id);

      const filepaths = [];

      if (selectedImageSecondary.value) {
        filepaths.push(
          await uploadImage(
            "pets_secondary",
            selectedImageSecondary.value,
            data[0].id,
            "pets",
            false
          )
        );
      }

      if (selectedImageThird.value) {
        filepaths.push(
          await uploadImage(
            "pets_third",
            selectedImageThird.value,
            data[0].id,
            "pets",
            false
          )
        );
      }

      await client
        .from("pets")
        .update({
          addimages: filepaths,
        })
        .eq("id", data[0].id);
    }

    successMsg.value = "Upload Success!";
    router.push("/agent/posts");
  }
  // #endregion
}

// #endregion
</script>

<template>
  <form @submit.prevent="submitForm" class="w-full flex justify-center">
    <div
      class="w-full max-w-[1350px] flex flex-col p-2 items-center rounded-lg"
    >
      <!-- Title -->
      <div class="w-full flex items-center flex-col p-2">
        <p class="text-3xl font-bold">Create Listing</p>
        <p class="text-sm my-2 text-gray-500 text-center">
          Help a pet find their forever home
        </p>
      </div>

      <!-- Content -->
      <div class="w-full flex justify-center">
        <!-- PC Image -->
        <div class="mr-4 w-fit bg-beige-200" v-show="width > 768">
          <div class="font-bold p-3 rounded-t-md bg-orange-500">Pet Images</div>

          <!-- Primary -->
          <div class="p-4" v-for="item in imageInputList.slice(0, 1)">
            <div
              class="flex items-center"
              :class="{ 'flex-col': width < 1440 }"
            >
              <div class="p-1">
                <p class="text-base py-1 font-bold text-center">
                  {{ item.label }}
                </p>
                <div class="w-60 h-60">
                  <img
                    :src="item.image"
                    class="w-full h-full flex items-center justify-center bg-gray-200 rounded-md object-cover"
                  />
                </div>
                <p class="text-red-600 text-center h-8">
                  <span
                    v-if="
                      item.selectedImage &&
                      !(
                        isImageFile(item.selectedImage) ||
                        isImageUrl(item.selectedImage)
                      )
                    "
                    >Please upload an image file.</span
                  >
                </p>
              </div>
              <div
                class="px-4 flex flex-col"
                :class="{
                  'items-center': width < 1440,
                  'items-start': width >= 1440,
                }"
              >
                <p
                  class="leading-6 w-full"
                  :class="{ 'text-center': width < 1440 }"
                >
                  {{ item.desc }}
                </p>
                <input
                  :id="item.key"
                  type="file"
                  accept="image/*"
                  @change="(event) => handleFileChange(item.key, event)"
                  class="hidden"
                />
                <label
                  :for="item.key"
                  class="bg-orange-500 w-fit p-2 rounded-md my-2 hover:cursor-pointer hover:bg-orange-500 transform hover:scale-105 ease-in duration-100"
                  >Upload Image</label
                >
              </div>
            </div>
          </div>

          <!-- Additional-->
          <hr class="py-4" />
          <div>
            <p class="text-base py-1 font-bold text-center">Secondary Photos</p>
            <p class="text-center">
              Additional photos for your pet to show it off to users
            </p>
            <div
              class="flex justify-around p-4"
              :class="{ 'flex-col': width < 1440 }"
            >
              <div
                v-for="item in width < 1440
                  ? imageInputList.slice(1, 2)
                  : imageInputList.slice(1)"
                class="flex flex-col items-center"
              >
                <div class="w-60 h-60">
                  <img
                    :src="item.image"
                    class="w-full h-full flex items-center justify-center bg-gray-200 rounded-md object-cover"
                  />
                </div>
                <p class="text-red-600 text-center h-8">
                  <span
                    v-if="
                      item.selectedImage &&
                      !(
                        isImageFile(item.selectedImage) ||
                        isImageUrl(item.selectedImage)
                      )
                    "
                    >Please upload an image file.</span
                  >
                </p>
                <input
                  :id="item.key"
                  type="file"
                  accept="image/*"
                  @change="(event) => handleFileChange(item.key, event)"
                  class="hidden"
                />
                <label
                  :for="item.key"
                  class="bg-orange-500 w-fit p-2 rounded-md my-2 hover:cursor-pointer hover:bg-orange-500 transform hover:scale-105 ease-in duration-100"
                  >Upload Image</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div
          class="w-full"
          :class="{
            'max-w-[700px]': width > 768,
          }"
        >
          <Accordion type="single" collapsible default-value="basic">
            <!-- Basic Details -->
            <AccordionItem value="basic">
              <AccordionTrigger
                class="p-3 bg-orange-400 hover:bg-orange-500 rounded-t-lg hover:no-underline focus:bg-orange-500"
              >
                Basic Details
              </AccordionTrigger>
              <AccordionContent
                class="bg-beige-200 px-2"
                :class="{ 'flex flex-col': width > 768 }"
              >
                <div :class="{ 'grow flex': width > 768 }">
                  <div :class="{ 'w-[52.5%]': width > 768 }">
                    <div
                      class="p-2"
                      v-for="(i, index) in inputList[0].slice(0, 7)"
                      :key="index"
                    >
                      <label :for="i.id" class="block m-1">{{ i.label }}</label>
                      <!-- Text and Number Input -->
                      <input
                        v-if="i.type === 'text' || i.type === 'number'"
                        :type="i.type"
                        :id="i.id"
                        v-model="formData[i.id]"
                        class="w-full p-2 text-sm"
                        :placeholder="i.placeholder"
                        :step="i.step"
                        required
                      />

                      <!-- Select -->
                      <select
                        v-else-if="i.type === 'select'"
                        v-model="formData[i.id]"
                        class="w-full p-2 text-sm"
                      >
                        <option v-for="(item, idx) in i.values" :value="item">
                          {{ item }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div :class="{ 'w-[47.5%]': width > 768 }">
                    <div
                      class="p-2"
                      v-for="(i, index) in inputList[0].slice(7, 9)"
                      :key="index"
                    >
                      <label :for="i.id" class="block m-1">{{ i.label }}</label>
                      <!-- Select -->
                      <select
                        v-if="i.type === 'select'"
                        v-model="formData[i.id]"
                        class="w-full p-2 text-sm"
                        required
                      >
                        <option v-for="(item, idx) in i.values" :value="item">
                          {{ item }}
                        </option>
                      </select>

                      <!-- Checkbox Inputs -->
                      <div
                        v-else-if="i.type === 'checkbox'"
                        v-for="(item, idx) in i.values"
                        :key="idx"
                        class="p-2 flex items-center"
                      >
                        <input
                          type="checkbox"
                          class="checked:bg-red-200"
                          :value="item"
                          v-model="formData[i.id]"
                          :disabled="
                            formData.personality.length > 2 &&
                            !formData.personality.includes(item)
                          "
                        />
                        <label class="text-sm ml-2">
                          {{ item.charAt(0).toUpperCase() + item.slice(1) }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grow">
                  <!-- Textarea -->
                  <div v-for="(i, index) in inputList[0].slice(9)" class="p-2">
                    <label :for="i.id" class="block m-1">{{ i.label }}</label>
                    <textarea
                      :key="index"
                      class="w-full p-2 text-sm"
                      :placeholder="i.placeholder"
                      v-model="formData[i.id]"
                      required
                    ></textarea>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Medical Records -->
            <AccordionItem value="medical">
              <AccordionTrigger
                class="p-3 bg-orange-400 hover:bg-orange-500 rounded-t-lg hover:no-underline focus:bg-orange-500"
                >Medical Records
              </AccordionTrigger>
              <AccordionContent class="bg-beige-200">
                <div v-for="(item, index) in inputList[1]" :key="index">
                  <fieldset class="py-4 px-2" v-if="item.legend">
                    <legend class="text-md font-bold py-2">
                      {{ item.legend }}
                    </legend>
                    <div class="text-sm" v-for="items in item.items">
                      <div v-if="items.type === 'date'">
                        <label class="block">{{ items.label }}</label>
                        <input
                          :type="items.type"
                          :max="items.max"
                          :id="items.id"
                          v-model="formData[items.id]"
                          class="w-full p-2 text-sm border border-grey-400"
                        />
                      </div>
                      <div v-else>
                        <label class="block">{{ items.label }}</label>
                        <select
                          v-model="formData[items.id]"
                          class="w-full p-2 border border-grey-400 mb-2"
                        >
                          <option
                            v-for="options in items.values"
                            :value="options"
                          >
                            {{ options }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  <div v-else class="p-2">
                    <label :for="item.id" class="block m-1 font-bold">{{
                      item.label
                    }}</label>
                    <textarea
                      class="w-full p-2 text-sm border border-grey-400"
                      :placeholder="item.placeholder"
                      v-model="formData[item.id]"
                    ></textarea>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Image -->
            <AccordionItem value="image" v-show="width <= 768">
              <AccordionTrigger
                class="p-3 bg-orange-400 hover:bg-orange-500 rounded-t-lg hover:no-underline focus:bg-orange-500"
              >
                Pet Images
              </AccordionTrigger>
              <AccordionContent class="bg-beige-200">
                <div
                  class="border border-gray-200 p-2"
                  v-for="item in imageInputList"
                >
                  <div class="flex items-center flex-col">
                    <div class="p-1">
                      <p class="text-base py-1 font-bold text-center">
                        {{ item.label }}
                      </p>
                      <div class="w-48 h-48">
                        <img
                          :src="item.image"
                          class="w-full h-full flex items-center justify-center rounded-md object-cover"
                        />
                        <p
                          v-show="
                            item.selectedImage &&
                            !(
                              isImageFile(item.selectedImage) ||
                              isImageUrl(item.selectedImage)
                            )
                          "
                          class="text-red-600 text-center"
                        >
                          Please upload an image file.
                        </p>
                      </div>
                    </div>
                    <div class="p-2 flex flex-col items-center">
                      <p class="leading-6 w-full text-center">
                        {{ item.desc }}
                      </p>
                      <input
                        :id="item.key"
                        type="file"
                        accept="image/*"
                        @change="(event) => handleFileChange(item.key, event)"
                        :required="item.required"
                        class="hidden"
                      />
                      <label
                        :for="item.key"
                        class="bg-orange-500 w-fit p-2 rounded-md my-2"
                        >Upload Image</label
                      >
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full flex flex-col justify-center m-4">
        <p class="h-8 w-full text-center">
          <span class="text-red-500">{{ errorMsg }}</span>
          <span class="text-green-700">{{ successMsg }}</span>
        </p>

        <div class="flex justify-center">
          <Button
            class="mx-2 bg-orange-500 hover:bg-orange-400"
            type="button"
            as-child
          >
            <NuxtLink to="/agent/posts">Cancel</NuxtLink>
          </Button>
          <Button class="mx-2 bg-emerald-500 hover:bg-emerald-400"
            >Submit</Button
          >
        </div>
      </div>
    </div>
  </form>
</template>
