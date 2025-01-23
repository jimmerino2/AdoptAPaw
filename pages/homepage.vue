<script setup>
import { useWindowSize } from "@vueuse/core";
import PetPreview from "~/composables/PetPreview.vue";
const { width } = useWindowSize();

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const role = ref("Guest");
if (user.value) {
  const { data } = await client
    .from("users")
    .select("role")
    .eq("user_id", user.value.id);
  role.value = data[0].role;
} else {
  user.value = "";
}

const { data } = await client
  .from("pets")
  .select("*")
  .eq("isadopted", false)
  .eq("status", "active")
  .range(0, 4);
const cards = [
  {
    label: "Adopt",
    img: "/homepage_adopt.png",
    link: "/adoption/listings",
    condition: role.value === "Guest" || role.value === "User",
  },
  {
    label: "Post",
    img: "/homepage_adopt.png",
    link: "/agent/posts",
    condition: role.value === "Agent",
  },
  {
    label: "Shelters",
    img: "/homepage_shelter.png",
    link: "/agent/shelters",
    condition: true,
  },

  {
    label: "FAQ",
    img: "/homepage_faq.png",
    link: "/tips",
    condition: true,
  },
  {
    label: "Donate",
    img: "/homepage_donate.png",
    link: "/donation",
    condition: true,
  },
];

function toPetDetails(pet) {
  router.push({
    path: "/adoption/details",
    query: { petid: pet.id, role: role.value },
  });
}
</script>

<template>
  <!-- Top Navigator -->
  <div
    class="relative flex flex-col items-center bg-[url('/public/wallpaper_home.png')]"
    :class="{ 'max-h-[400px] border-b-8 border-orange-700': width >= 900 }"
  >
    <div class="absolute inset-0 opacity-50 bg-white"></div>
    <div
      class="flex flex-col items-center my-4 text-center"
      :class="{ 'my-12 py-4': width >= 900 }"
    >
      <div class="text-5xl p-5 pt-12 z-20 font-bold">Adopt Today</div>
      <div class="text-2xl p-5 text-center z-20 font-bold">
        Browse through our listings to find a pet suitable for you.
      </div>
    </div>

    <!-- Center Cards-->
    <div
      class="grid grid-flow-col grid-cols-auto-fill justify-around z-20"
      :class="{
        'grid-rows-1 gap-4': width >= 900,
        'grid-rows-2 gap-2': width < 900,
      }"
    >
      <NuxtLink
        v-for="(item, index) in cards"
        :key="index"
        :to="item.link"
        v-show="item.condition"
      >
        <div
          class="flex m-3 items-center justify-center bg-orange-50 text-orange-700 shadow-2xl flex-col text-xl font-bold rounded-2xl ease-in duration-100 border-4 border-transparent hover:border-orange-500 transform hover:scale-105"
          :class="{
            'size-[11rem]': width >= 768,
            'size-[14rem]': width >= 568 && width < 768,
            'size-[11.5rem]': width < 568 && width >= 450,
            'size-[8.5rem]': width < 450,
          }"
        >
          <img :src="item.img" alt="icon_image" class="size-3/4" />
          {{ item.label }}
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- About Us -->
  <div class="scaling bg-orange-100 py-14 flex flex-col items-center">
    <img src="/public/logo_font.png" class="w-72" />
    <p class="text-2xl pt-4 text-orange-700 font-bold">About Us</p>
    <div class="flex items-center" :class="{ 'flex-col': width < 1350 }">
      <p
        class="text-orange-700"
        :class="{
          'text-md text-center': width < 576,
          'text-lg text-center': width >= 576 && width < 1024,
          'text-lg text-left': width >= 1024,
        }"
      >
        Our website aims to help shelters and individuals across the country to
        find potential adopters for strays or animals in need.
        <br /><br />
        We hope to work together with other organizations to streamline their
        adoption processes and make a difference in addressing the problem where
        strays are commonly found and neglected in Malaysia.
        <br /><br />
        This website is currently run purely by donations. Help us and our
        partnered shelters by adopting or donating to our cause, thank you!
      </p>
      <img src="/wallpaper_about.jpg" class="rounded-lg m-2 shadow-2xl" />
    </div>
  </div>

  <!-- Sample Listings -->
  <div class="scaling bg-orange-400 mt-2 flex flex-col items-center py-5">
    <p class="text-white text-3xl">Start Adopting Today</p>
    <div
      class="grid my-4 gap-4"
      :class="{
        'grid-cols-1': width < 576,
        'grid-cols-2': width >= 576 && width < 1024,
        'grid-cols-3': width >= 1024 && width < 1250,
        'grid-cols-4': width >= 1250 && width < 1500,
        'grid-cols-5': width >= 1500,
      }"
    >
      <PetPreview
        v-for="pet in data"
        :pet="pet"
        @selectPet="toPetDetails(pet)"
      />
    </div>
    <Button
      as-child
      v-if="role !== 'Agent'"
      class="mt-4 mb-2 bg-orange-800 hover:bg-orange-700"
      ><NuxtLink to="/adoption/listings">To Listings Page</NuxtLink></Button
    >
  </div>
</template>
