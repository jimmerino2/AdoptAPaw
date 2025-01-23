<script setup>
import { useWindowSize } from "@vueuse/core";
import { ChevronsUp, ChevronsDown } from "lucide-vue-next";
import { useFetchData } from "@/composables/useFetchData";

const { width } = useWindowSize();
const { fetchData, fetchImage } = useFetchData();
const user = useSupabaseUser();
const router = useRouter();

const profileDetails = ref();
const profile = ref({ role: "Guest", imagepath: "" });
const imageUrl = ref("");
const parentLinks = ref([]);

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

        <div class="flex justify-end custom-sm:justify-between">
          <!-- Profile -->
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

              <Collapsible v-for="parent in parentLinks" class="w-full">
                <NuxtLink :to="parent.link" v-show="parent.condition">
                  <CollapsibleTrigger
                    class="w-full text-left text-xl flex justify-between items-center h-12 py-8 pl-4 focus:bg-orange-300 text-white ease-in duration-100"
                    @click="toggleChevron"
                  >
                    <div class="flex items-center">
                      <p class="text-xl">{{ parent.title }}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="w-9 p-0 bg-transparent"
                      v-show="parent.childLinks.length > 0"
                    >
                      <ChevronsDown
                        v-if="!chevronIsDown"
                        class="h-4 w-4"
                        @click="toggleChevron()"
                      />
                      <ChevronsUp
                        v-else
                        class="h-4 w-4"
                        @click="toggleChevron()"
                      />
                      <span class="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </NuxtLink>

                <CollapsibleContent
                  v-for="child in parent.childLinks"
                  class="w-full"
                >
                  <NuxtLink :to="child.link">
                    <div
                      class="w-full p-4 text-xl pl-6 hover:bg-orange-300 text-white ease-in duration-100"
                    >
                      {{ child.title }}
                    </div>
                  </NuxtLink>
                </CollapsibleContent>
              </Collapsible>
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
      <!-- Shelter Account Banner -->
      <!--
      <div
        class="bg-teal-100 w-full custom-lg:px-[10vw] custom-md:px-[2vw] flex justify-center text-lg p-2 font-bold"
      >
        Shelter Account
      </div>
       -->
    </div>
  </div>
</template>
