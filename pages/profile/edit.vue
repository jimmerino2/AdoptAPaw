<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useUploadImage } from "@/composables/useUploadImage";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  middleware: ["auth"],
});

const { width } = useWindowSize();
const { uploadImage } = useUploadImage();
const { fetchData, fetchUser } = useFetchData();
const { valName, valContact } = useFormValidation();

const user = useSupabaseUser();
const client = useSupabaseClient();
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

  window.location.reload();
};

const formData = ref({
  name: profile.name,
  contact: profile.contact,
});

async function submitForm() {
  try {
    // Checking
    if (!formData.value.name || !formData.value.contact) {
      errorMsg.value = "All fields must be filled in.";
    } else if (!valName(formData.value.name)) {
      errorMsg.value = "Name must have 6 to 15 alphabetical characters.";
    } else if (!valContact(formData.value.contact)) {
      errorMsg.value = "Invalid Malaysian contact format.";
    } else {
      errorMsg.value = "";
      const { error } = await client
        .from("users")
        .update({
          name: formData.value.name,
          contact: formData.value.contact,
        })
        .eq("user_id", user.value.id)
        .select();

      if (error) throw error;
      if (!error) {
        window.location.reload();
      }
    }
  } catch (error) {
    errorMsg.value = error;
  }
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
            class="bg-slate-200 flex justify-end items-center py-0 h-24"
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
