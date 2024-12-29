<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useUploadImage } from "@/composables/useUploadImage";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const { uploadImage } = useUploadImage();
const { fetchData, fetchImage, fetchUser } = useFetchData();

const authUserData = await fetchUser();
const profileDetails = await fetchData("users", "*", [
  "email",
  authUserData.email,
]);
const profile = profileDetails[0];
const errorMsg = ref(null);

const selectedFile = ref(null);

const changeProfileImage = async (event) => {
  errorMsg.value = null;
  const file = event.target.files[0];

  if (!file) {
    console.error("No file selected");
    return;
  }

  // Validate MIME type
  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validImageTypes.includes(file.type)) {
    errorMsg.value = "Please upload a valid image file (JPEG, PNG, GIF).";
    return;
  }
  selectedFile.value = file;
  await uploadImage(
    "profile_pictures",
    selectedFile.value,
    profile.id,
    "users",
    true
  );
  console.log("Profile Picture Changed");
  window.location.reload();
};

const formData = ref({
  name: "",
  contact: "",
});

async function submitForm() {
  try {
    const validated = ref(true);
    const nameRegEx = /^[a-zA-Z_]{6,30}$/;

    // Check if fields are filled
    if (
      formData.value.name === undefined ||
      formData.value.contact === undefined
    ) {
      errorMsg.value = "All fields must be filled in.";
      validated.value = false;
    }
    // Check name format
    else if (!nameRegEx.test(formData.value.name)) {
      errorMsg.value = "Name must have 5 to 30 alphabetical characters.";
      validated.value = false;
    }
  } catch (error) {}
}
</script>

<template>
  <div
    class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] pt-2 pb-10"
    :class="{ flex: width >= 1024 }"
  >
    <ProfileCard />
    <div
      class="grow rounded-md bg-slate-300 justify-self-center"
      :class="{
        'w-11/12': width < 1024,
        'mt-16 w-1/2': width >= 1024,
      }"
    >
      <form @submit.prevent="submitForm">
        <Card class="w-full h-full">
          <CardHeader class="bg-slate-300">
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col bg-slate-100 py-4">
            <div class="py-2">
              <h1 class="text-lg">Name</h1>
              <input
                type="text"
                class="w-full p-2 my-2 border border-grey"
                v-model="formData.name"
                required
              />
            </div>
            <div class="py-2">
              <h1 class="text-lg">Contact</h1>
              <input
                type="text"
                class="w-full p-2 my-2 border border-grey"
                v-model="formData.contact"
                required
              />
            </div>
            <div class="h-12">
              <p v-if="errorMsg" class="text-red-500 text-md">
                {{ errorMsg }}
              </p>
            </div>
          </CardContent>
          <CardFooter
            class="bg-slate-200 flex justify-end items-center py-0 h-16"
          >
            <Button class="max-w-32 mr-2" as-child>
              <label for="new_pfp" class="cursor-pointer">
                <input
                  type="file"
                  id="new_pfp"
                  @change="changeProfileImage"
                  hidden
                />
                Change Photo
              </label>
              <!-- Submit Button to trigger the handlePhotoChange -->
              <button type="submit" class="hidden"></button>
            </Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>
