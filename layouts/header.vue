<script setup>
import { useWindowSize } from "@vueuse/core";
import { ChevronsUpDown, User } from "lucide-vue-next";
import { useFetchData } from "@/composables/useFetchData";

const { width } = useWindowSize();
const isOpen = [ref(false), ref(false), ref(false), ref(false), ref(false)];
const user = useSupabaseUser();
const router = useRouter();

const { fetchData, fetchImage, fetchUser } = useFetchData();

const imageUrl = ref("");
// Set Profile Icon
onMounted(async () => {
  if (!user.value) {
    imageUrl.value = ""; // No path if not logged in
  } else {
    const authUserData = await fetchUser();
    const profileDetails = await fetchData("users", "*", [
      "email",
      authUserData.email,
    ]);
    const profile = profileDetails[0];

    if (profile.imagepath == null) {
      imageUrl.value = "/profile-icon.png";
    } else {
      const profileImage = fetchImage(profile.imagepath);
      imageUrl.value = profileImage;
    }
  }
});

// Change between Button and Profile icon
const isUserLoggedIn = computed(() => {
  return user.value !== null && user.value !== undefined;
});

// Redirect for Profile
function toProfile() {
  if (!user.value) {
    router.push("/auth/login");
  } else {
    router.push("/auth/profile");
  }
}
</script>

<template>
  <div class="sticky top-0 flex z-20 flex-col m-0">
    <!-- Logo and Profile -->
    <div
      class="flex items-center h-24 bg-slate-500 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
    >
      <div class="flex-grow flex items-center justify-between">
        <!-- Logo -->
        <div class="ml-2 flex items-center">
          <Avatar class="size-12">
            <AvatarImage src="/logo_v1.png" />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
          <p class="text-2xl ml-2">AdoptAPaw</p>
        </div>

        <div class="flex justify-end custom-sm:justify-between">
          <!-- Profile -->
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Avatar
                  class="size-12 mr-2 hover:cursor-pointer"
                  @click="toProfile"
                  v-show="isUserLoggedIn"
                >
                  <AvatarImage :src="imageUrl" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>

                <Button
                  v-show="!isUserLoggedIn"
                  @click="toProfile"
                  class="self-center mx-2"
                >
                  Log In
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Menu for Mobile -->
          <Sheet>
            <SheetTrigger>
              <Avatar
                class="size-12 bg-transparent"
                :class="{ hidden: width >= 625 }"
              >
                <AvatarImage src="/menu-icon.png" />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent side="left" class="p-0 bg-slate-200">
              <SheetHeader class="p-2 bg-slate-400">
                <SheetTitle class="text-left flex items-center">
                  <Avatar class="size-12 mr-2">
                    <AvatarImage src="/logo_v1.png" />
                    <AvatarFallback>Logo</AvatarFallback>
                  </Avatar>
                  AdoptAPaw
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>

              <Collapsible
                v-for="(parent, index) in parentLinks"
                v-model:open="isOpen[index].value"
                class="p-2 my-2 w-full border-y border-solid border-black"
              >
                <NuxtLink :to="parent.link">
                  <CollapsibleTrigger
                    class="w-full text-left flex justify-between items-center h-8"
                  >
                    <div>{{ parent.title }}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="w-9 p-0 bg-transparent"
                      v-show="parent.childLinks.length > 0"
                    >
                      <ChevronsUpDown class="h-4 w-4" />
                      <span class="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </NuxtLink>
                <CollapsibleContent
                  v-for="child in parent.childLinks"
                  class="bg-slate-300 p-1"
                >
                  <NuxtLink :to="child.link">{{ child.title }}</NuxtLink>
                </CollapsibleContent>
              </Collapsible>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>

    <!-- Menu for Desktop -->
    <div
      class="bg-slate-300 custom-lg:px-[10vw] custom-md:px-[2vw] custom-md:flex"
    >
      <Menubar
        class="bg-slate-300 border-none flex w-full justify-between py-2"
        v-show="width >= 625"
      >
        <MenubarMenu v-for="(parent, index) in parentLinks" :key="index">
          <NuxtLink :to="parent.link">
            <MenubarTrigger
              class="text-lg h-full hover:bg-slate-100 cursor-pointer"
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
              <NuxtLink :to="child.link">{{ child.title }}</NuxtLink>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentLinks: [
        {
          title: "Homepage",
          link: "/homepage",
          childLinks: [],
        },
        {
          title: "Adopt",
          link: "/adoptions",
          childLinks: [],
        },
        {
          title: "Shelters",
          link: "/shelters",
          childLinks: [],
        },
        {
          title: "Donations",
          link: "/donation",
          childLinks: [],
        },
        {
          title: "Support",
          link: null,
          childLinks: [
            {
              title: "FAQ Section",
              link: "/faq",
            },
            {
              title: "Contact Us",
              link: "/contact",
            },
            {
              title: "Tips for Adopting",
              link: "/tips",
            },
          ],
        },
      ],
    };
  },
};
</script>
