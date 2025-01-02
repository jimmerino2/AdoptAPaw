<script setup>
import { useFetchData } from "@/composables/useFetchData";
const { fetchData, fetchImage, fetchUser } = useFetchData();
import { useWindowSize } from "@vueuse/core";
import AvatarImage from "~/components/ui/avatar/AvatarImage.vue";

const { width } = useWindowSize();
const authUserData = await fetchUser();
const profileDetails = await fetchData("users", "*", [
  "email",
  authUserData.email,
]);
const profile = profileDetails[0];

const client = useSupabaseClient();
const router = useRouter();

// Determine Profile Picture
const imagePath = ref("");

// Logout
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

onMounted(async () => {
  if (profile.imagepath == null) {
    imagePath.value = "/profile-icon.png";
  } else {
    imagePath.value = fetchImage(profile.imagepath);
  }
});
</script>

<template>
  <div class="mt-10" :class="{ 'min-w-[350px]': width >= 1024 }">
    <Card class="m-6 bg-slate-300">
      <CardHeader class="relative">
        <CardTitle class="flex flex-col items-center">
          <div
            class="absolute top-[-40px] border border-black size-28 left-1/2 transform -translate-x-1/2 bg-slate-100 overflow-hidden rounded-full"
          >
            <Avatar class="size-full">
              <AvatarImage v-if="profile.imagepath" :src="imagePath" />
              <AvatarImage v-else src="/public/profile-icon.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <span class="mt-16 mb-2"> {{ profile.name }}</span>
          <div class="flex items-center">
            <NuxtLink to="/profile/edit">
              <Button class="px-4 m-2">Edit Profile</Button>
            </NuxtLink>
            <Button @click="logout">Log Out</Button>
          </div>
          <hr class="mt-2 border border-black w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h1 class="font-bold">Email</h1>
        <p class="mb-2">{{ profile.email }}</p>
        <h1 class="font-bold">Contact</h1>
        <p class="mb-2">{{ profile.contact }}</p>
      </CardContent>
      <CardFooter class="p-0 flex flex-col">
        <NuxtLink to="/profile/appointments" class="px-4 bg-slate-400 w-full">
          <div class="flex items-center justify-between w-full my-2">
            <p>View Appointments</p>
            <img class="size-4" src="/public/right_arrow.png" />
          </div>
        </NuxtLink>
        <NuxtLink to="/profile/favorites" class="px-4 bg-slate-300 w-full">
          <div class="flex items-center justify-between w-full my-2">
            <p>View Favorites</p>
            <img class="size-4" src="/public/right_arrow.png" />
          </div>
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
