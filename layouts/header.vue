<script setup>
import { useWindowSize } from "@vueuse/core";
import { ChevronsUpDown } from "lucide-vue-next";
import { useFetchData } from "@/composables/useFetchData";

const { width } = useWindowSize();
const isOpen = [ref(false), ref(false), ref(false), ref(false), ref(false)];

const { fetchData, fetchImage } = useFetchData();
const user = useSupabaseUser();
const router = useRouter();

const profileDetails = ref();
const profile = ref({ role: "Guest", imagepath: "" });
const imageUrl = ref("");
const parentLinks = ref([]);

watchEffect(async () => {
  if (user.value?.id) {
    try {
      profileDetails.value = await fetchData("users", "*", [
        "user_id",
        user.value.id,
      ]);

      profile.value = profileDetails.value?.[0] || {
        role: "Guest",
        imagepath: "",
      };
      console.log("Profile loaded:", profile.value);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
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
      title: "Post",
      link: "/agent/post",
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
      link: "/shelters",
      childLinks: [],
      condition: true,
    },
    {
      title: "Donations",
      link: "/donation",
      childLinks: [],
      condition: true,
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
      condition: true,
    },
  ];
});

async function toProfile() {
  if (profile.value.role === "Agent") {
    router.push("/profile/posts");
  } else if (profile.value.role === "Guest" || profile.value.role === "User") {
    router.push("/profile/appointments");
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
                  v-show="user"
                  @click="toProfile()"
                >
                  <AvatarImage :src="imageUrl" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>

                <Button as-child v-show="!user" class="self-center mx-2">
                  <NuxtLink to="/auth/login"> Log In </NuxtLink>
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
                class="w-full"
              >
                <NuxtLink :to="parent.link" v-show="parent.condition">
                  <CollapsibleTrigger
                    class="w-full text-left flex justify-between items-center border-y border-solid border-black h-12 px-2 my-4"
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
    <div class="bg-slate-300">
      <!-- Menubar -->
      <div
        class="custom-lg:px-[10vw] custom-md:px-[2vw] flex flex-col"
        v-show="width >= 625"
      >
        <Menubar
          class="bg-slate-300 border-none flex w-full justify-between py-2"
        >
          <MenubarMenu v-for="(parent, index) in parentLinks" :key="index">
            <NuxtLink :to="parent.link" v-show="parent.condition">
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
