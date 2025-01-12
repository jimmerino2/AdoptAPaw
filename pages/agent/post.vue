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
      step: "0.02",
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
      label: "Description",
      placeholder: "Enter description",
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

const isImage = (file) => {
  return file.type.startsWith("image/");
};

const imageInputList = ref([
  {
    key: "primary",
    label: "Primary Photo",
    selectedImage: computed(() => {
      return selectedImagePrimary.value;
    }),
    image: computed(() => {
      return selectedImagePrimary.value && isImage(selectedImagePrimary.value)
        ? createObjectURL(selectedImagePrimary.value)
        : null;
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
      return selectedImageSecondary.value &&
        isImage(selectedImageSecondary.value)
        ? createObjectURL(selectedImageSecondary.value)
        : null;
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
      return selectedImageThird.value && isImage(selectedImageThird.value)
        ? createObjectURL(selectedImageThird.value)
        : null;
    }),
    desc: "Extra photos if may.",
  },
]);
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
    !(selectedImagePrimary.value && isImage(selectedImagePrimary.value))
  ) {
    verified.value = false;
    errorMsg.value = "Primary image not filled.";
  } else if (
    (selectedImageSecondary.value && !isImage(selectedImageSecondary.value)) ||
    (selectedImageThird.value && !isImage(selectedImageThird.value))
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

  // Submission
  if (verified.value) {
    // Insertion
    const userData = await fetchData("users", "id", ["user_id", user.value.id]);
    const agentData = await fetchData("agents", "id", ["uid", userData[0].id]);
    const breed = formData.value.breed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    function convBoolean(value) {
      return value === "Yes" ? true : false;
    }

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

    successMsg.value = "Upload Success!";
    router.push("/profile/posts");
  }
}

// #endregion
</script>

<template>
  <form @submit.prevent="submitForm" class="w-full flex justify-center">
    <div
      class="bg-white w-full max-w-[1350px] h-fit flex flex-col p-8 items-center rounded-md"
    >
      <!-- Title -->
      <div class="w-fullflex items-center flex-col p-2">
        <p class="text-3xl font-bold">Create Listing</p>
        <p class="text-sm my-2 text-gray-500">
          Help a pet find their forever home
        </p>
      </div>

      <!-- Content -->
      <div class="w-full flex justify-center">
        <!-- PC Image -->
        <div class="mr-4 p-2 w-fit border border-gray-200" v-show="width > 768">
          <div class="font-bold p-2">Pet Images</div>

          <!-- Primary -->
          <div class="p-2" v-for="item in imageInputList.slice(0, 1)">
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
                    v-if="item.selectedImage && !isImage(item.selectedImage)"
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
                  class="bg-slate-400 w-fit p-2 rounded-md my-2 hover:cursor-pointer hover:bg-slate-100 duration-200"
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
                    v-if="item.selectedImage && !isImage(item.selectedImage)"
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
                  class="bg-slate-400 w-fit p-2 rounded-md my-2 hover:cursor-pointer hover:bg-slate-100 duration-200"
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
                class="p-3 border border-gray-200 justify-start hover:no-underline"
              >
                Basic Details
              </AccordionTrigger>
              <AccordionContent
                class="border border-gray-200"
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
                        class="w-full p-2 text-sm border border-grey-400"
                        :placeholder="i.placeholder"
                        :step="i.step"
                        required
                      />

                      <!-- Select -->
                      <select
                        v-else-if="i.type === 'select'"
                        v-model="formData[i.id]"
                        class="w-full p-2 text-sm border border-grey-400"
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
                        class="w-full p-2 text-sm border border-grey-400"
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
                      class="w-full p-2 text-sm border border-grey-400"
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
                class="p-3 border border-gray-200 justify-start hover:no-underline"
                >Medical Records
              </AccordionTrigger>
              <AccordionContent class="border border-gray-200">
                <div v-for="(item, index) in inputList[1]" :key="index">
                  <fieldset
                    class="border border-gray-200 m-2 p-2"
                    v-if="item.legend"
                  >
                    <legend class="text-md font-bold">{{ item.legend }}</legend>
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
                class="p-3 border border-gray-200 justify-start hover:no-underline"
              >
                Pet Images
              </AccordionTrigger>

              <AccordionContent class="border border-gray-200">
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
                          class="w-full h-full flex items-center justify-center bg-gray-200 rounded-md object-cover"
                        />
                        <p
                          v-show="
                            item.selectedImage && !isImage(item.selectedImage)
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
                        class="bg-slate-400 w-fit p-2 rounded-md my-2 hover:cursor-pointer hover:bg-slate-100 duration-200"
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
          <Button class="mx-2" type="button" as-child>
            <NuxtLink to="/profile/posts">Cancel</NuxtLink>
          </Button>
          <Button class="mx-2">Submit</Button>
        </div>
      </div>
    </div>
  </form>
</template>
