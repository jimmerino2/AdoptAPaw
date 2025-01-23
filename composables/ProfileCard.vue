<script setup>
import { useFetchData } from "@/composables/useFetchData";
const { fetchData, fetchImage } = useFetchData();
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const user = useSupabaseUser();
const profileDetails = await fetchData("users", "*", [
  "user_id",
  user.value.id,
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

// Links
const links = [
  {
    link: "/profile/appointments",
    label: "Appointments",
    show: profile.role === "User",
  },
  {
    link: "/profile/favorites",
    label: "Favorites",
    show: profile.role === "User",
  },
  {
    link: "/profile/requests",
    label: "Appointment Requests",
    show: profile.role === "Agent",
  },
];
</script>

<template>
  <div class="mt-10" :class="{ 'min-w-[350px]': width >= 1024 }">
    <Card
      class="m-6 bg-beige-300 hover:shadow-xl hover:scale-[101%] ease-in duration-100"
    >
      <CardHeader class="relative">
        <CardTitle class="flex flex-col items-center">
          <div
            class="absolute top-[-40px] border-4 border-white size-28 left-1/2 transform -translate-x-1/2 overflow-hidden rounded-full"
          >
            <Avatar class="size-full">
              <AvatarImage v-if="profile.imagepath" :src="imagePath" />
              <AvatarImage v-else src="/profile-icon.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <span class="mt-16 mb-2 text-center"> {{ profile.name }}</span>
          <div class="flex items-center">
            <NuxtLink to="/profile/edit">
              <Button class="px-4 m-2 bg-amber-600 hover:bg-amber-500"
                >Edit Profile</Button
              >
            </NuxtLink>
            <Button
              class="m-2 bg-orange-700 hover:bg-orange-600"
              @click="logout"
              >Log Out</Button
            >
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
      <CardFooter class="p-0 flex flex-col rounded-b-md overflow-hidden">
        <NuxtLink
          v-for="(item, index) in links"
          :key="index"
          :to="item.link"
          v-show="item.show"
          class="px-4 w-full"
          :class="{
            'bg-orange-400 hover:bg-orange-300': index % 2 === 0,
            'bg-amber-400 hover:bg-amber-300': index % 2 === 1,
          }"
        >
          <div class="flex items-center justify-between w-full my-2">
            <p>{{ item.label }}</p>
            <img class="size-3" src="/public/right_arrow.png" />
          </div>
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
