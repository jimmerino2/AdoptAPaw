<script setup>
import { useFetchData } from "@/composables/useFetchData";
import { useUploadImage } from "@/composables/useUploadImage";
import { useWindowSize } from "@vueuse/core";
definePageMeta({
  middleware: ["auth"],
});

const { width } = useWindowSize();
const { fetchData, fetchImage, fetchUser } = useFetchData();
const { uploadImage } = useUploadImage();

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    router.push("/homepage").then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.log(error);
  }
}

// Get the User Data from DB based off login email
const authUserData = await fetchUser();
const profileDetails = await fetchData("users", "*", [
  "email",
  authUserData.email,
]);
const profile = profileDetails[0];

// Validate Image and Change
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

// Determine Profile Picture
const imagePath = ref("");

onMounted(async () => {
  if (profile.imagepath == null) {
    imagePath.value = "/profile-icon.png";
  } else {
    imagePath.value = fetchImage(profile.imagepath);
  }
});

const profileInfoList = [
  {
    title: "Name",
    desc: profile.name,
  },
  {
    title: "Email",
    desc: profile.email,
  },
  {
    title: "Contact Number",
    desc: profile.contact,
  },
  {
    title: "Address",
    desc: profile.address,
  },
];
</script>

<template>
  <div>
    <Card class="w-[95%] justify-self-center m-4 max-w-[1200px]">
      <CardHeader class="items-center bg-slate-300">
        <CardTitle>Profile Card</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent class="bg-slate-100 py-8" :class="{ flex: width >= 850 }">
        <div class="flex items-center flex-col mx-8">
          <img
            :src="imagePath"
            class="h-64 w-64 rounded object-cover"
            :class="{ 'size-64': width >= 1000 }"
          />
          <Button class="max-w-48 m-4" as-child>
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
          <span class="text-red-500">{{ errorMsg }}</span>
        </div>

        <div class="flex flex-col grow mx-8">
          <div v-for="item in profileInfoList">
            <p class="text-xl font-bold">{{ item.title }}:</p>
            <p class="text-lg">{{ item.desc }}</p>
            <br />
          </div>
        </div>
      </CardContent>
      <CardFooter class="bg-slate-300 py-4 flex justify-end">
        <Button class="mx-2 w-[80px]">Edit</Button>
        <Button class="mx-2 w-[80px]" @click="logout">Logout</Button>
      </CardFooter>
    </Card>
  </div>
</template>
