<script setup>
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "@/composables/useFetchData";

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const profileDetails = ref();
const profile = ref({ role: "Guest", imagepath: "" });
const imageUrl = ref("");
const parentLinks = ref([]);
const agentAppointments = ref([]);
const userAppointments = ref([]);

const chevronIsDown = ref(false);
function toggleChevron() {
  chevronIsDown.value = !chevronIsDown.value;
}

watchEffect(async () => {
  if (user.value?.id) {
    profileDetails.value = await fetchData("users", "*", [
      "user_id",
      user.value.id,
    ]);

    profile.value = profileDetails.value?.[0] || {
      role: "Guest",
      imagepath: "",
    };
  }

  // Set Profile Icon
  if (!user.value) {
    imageUrl.value = ""; // No path if not logged in
  } else {
    if (profile.value.imagepath === null || profile.value.imagepath === "") {
      imageUrl.value = "/profile-icon.png";
    } else {
      const profileImage = fetchImage(profile.value.imagepath);
      imageUrl.value = profileImage;
    }
  }

  // #region Notifications
  if (profile.value.role === "Agent") {
    const { data } = await client
      .from("appointments")
      .select("approved")
      .is("approved", null)
      .eq("status", "active");

    agentAppointments.value = data;
  }

  if (profile.value.role === "User") {
    const { data } = await client
      .from("appointments")
      .select("isread")
      .not("approved", "is", null)
      .is("isread", false)
      .eq("status", "active");

    userAppointments.value = data;
  }
  // #endregion

  // Set Links
  parentLinks.value = [
    {
      title: "Homepage",
      link: "/homepage",
      childLinks: [],
      condition: true,
    },
    {
      title: "Posts",
      link: "/agent/posts",
      childLinks: [],
      condition: profile.value.role === "Agent",
    },
    {
      title: "Adopt",
      link: "/adoption/listings",
      childLinks: [],
      condition:
        profile.value.role === "User" || profile.value.role === "Guest",
    },
    {
      title: "Shelters",
      link: "/agent/shelters",
      childLinks: [],
      condition: true,
    },
    {
      title: "FAQ",
      link: "/tips",
      childLinks: [],
      condition: true,
    },
    {
      title: "Donations",
      link: "/donation",
      childLinks: [],
      condition: true,
    },
  ];
});

async function toProfile() {
  if (profile.value.role === "Agent") {
    router.push("/profile/requests");
  } else if (profile.value.role === "Guest" || profile.value.role === "User") {
    router.push("/profile/appointments");
  }
}

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
</script>

<template>
  <div class="sticky top-0 flex z-20 flex-col m-0">
    <div class="flex items-center h-24 bg-beige-300 scaling z-20">
      <div class="flex-grow flex items-center justify-between">
        <!-- Logo -->
        <div class="ml-2 flex items-center">
          <NuxtLink to="/homepage">
            <img src="/public/logo_font.png" class="w-48" />
          </NuxtLink>
        </div>

        <div class="flex justify-end custom-sm:justify-between relative">
          <!-- PC Logout -->
          <AlertDialog>
            <AlertDialogTrigger v-if="width >= 625 && user">
              <Button class="m-2 bg-orange-700 hover:bg-orange-600"
                >Log Out</Button
              >
            </AlertDialogTrigger>
            <AlertDialogContent class="bg-orange-50">
              <AlertDialogHeader>
                <AlertDialogTitle>Log Out</AlertDialogTitle>
                <AlertDialogDescription class="text-black"
                  >Are you sure you want to log out of your
                  account.</AlertDialogDescription
                >
                <AlertDialogFooter>
                  <AlertDialogCancel
                    class="bg-orange-500 hover:bg-orange-400 text-white"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    @click="logout"
                    class="bg-emerald-500 hover:bg-emerald-400"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
          <!-- Profile -->
          <div
            class="absolute top-[-5px] right-0 bg-orange-400 size-6 rounded-full text-center"
            v-show="agentAppointments.length > 0 || userAppointments.length > 0"
          >
            <span v-if="agentAppointments.length > 0">{{
              agentAppointments.length
            }}</span>
            <span v-else-if="userAppointments.length > 0">{{
              userAppointments.length
            }}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Avatar
                  class="size-12 mr-2 hover:cursor-pointer"
                  v-show="user"
                  @click="toProfile()"
                >
                  <AvatarImage :src="imageUrl" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>

                <NuxtLink to="/auth/login" v-show="!user">
                  <img
                    src="/public/profile-icon.png"
                    class="size-12 bg-orange-700 rounded-full p-1 mx-2"
                  />
                </NuxtLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Menu for Mobile -->
          <Sheet v-if="width < 625">
            <SheetTrigger>
              <img class="size-12" src="/menu-icon.png" />
            </SheetTrigger>
            <SheetContent side="left" class="p-0 bg-orange-500 w-5/6">
              <SheetHeader class="gap-0 py-6 bg-beige-100 pl-4">
                <SheetTitle class="h-full flex items-center">
                  <img src="/public/logo_font.png" class="w-48" />
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>

              <NuxtLink
                :to="parent.link"
                v-show="parent.condition"
                v-for="parent in parentLinks"
              >
                <div
                  class="w-full text-left text-xl flex justify-between items-center h-12 py-8 pl-4 hover:bg-orange-300 text-white ease-in duration-200"
                >
                  <div class="flex items-center">
                    <p class="text-xl">{{ parent.title }}</p>
                  </div>
                </div>
              </NuxtLink>

              <AlertDialog>
                <AlertDialogTrigger v-show="user">
                  <div
                    class="w-full text-left bottom-0 absolute text-xl flex justify-between items-center h-12 py-8 pl-4 hover:bg-orange-300 text-white ease-in duration-200"
                  >
                    Log Out
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent class="bg-orange-50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log Out</AlertDialogTitle>
                    <AlertDialogDescription class="text-black"
                      >Are you sure you want to log out of your
                      account.</AlertDialogDescription
                    >
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        class="bg-orange-500 hover:bg-orange-400 text-white"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        @click="logout"
                        class="bg-emerald-500 hover:bg-emerald-400"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>

    <!-- Menu for Desktop -->
    <div class="bg-orange-700 opacity-90">
      <!-- Menubar -->
      <div class="scaling flex flex-col" v-show="width >= 625">
        <Menubar
          class="bg-transparent border-none flex w-full justify-between py-2"
        >
          <MenubarMenu v-for="(parent, index) in parentLinks" :key="index">
            <NuxtLink :to="parent.link" v-show="parent.condition">
              <MenubarTrigger
                class="text-lg h-full text-white hover:bg-orange-600 cursor-pointer"
              >
                {{ parent.title }}
              </MenubarTrigger>
            </NuxtLink>

            <MenubarContent
              class="p-0"
              :class="{
                hidden: parent.childLinks.length == 0,
              }"
            >
              <MenubarItem
                v-for="(child, childIndex) in parent.childLinks"
                :key="childIndex"
                class="p-4 text-md"
                as-child
              >
                <NuxtLink :to="child.link" class="focus:bg-orange-100">{{
                  child.title
                }}</NuxtLink>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  </div>
</template>
