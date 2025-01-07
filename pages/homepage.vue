<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

const user = useSupabaseUser();
const client = useSupabaseClient();

const role = ref("Guest");
if (user.value) {
  const { data } = await client
    .from("users")
    .select("role")
    .eq("user_id", user.value.id);
  role.value = data[0].role;
}

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
    link: "/profile/posts",
    condition: role.value === "Agent",
  },
  {
    label: "Shelters",
    img: "/homepage_shelter.png",
    link: "/shelters",
    condition: true,
  },

  {
    label: "FAQ",
    img: "/homepage_faq.png",
    link: "/faq",
    condition: true,
  },
  {
    label: "Donate",
    img: "/homepage_donate.png",
    link: "/donation",
    condition: true,
  },
];
</script>

<template>
  <!-- #region Top Navigator -->
  <div
    class="relative h-fit py-4 flex flex-col items-center bg-slate-400 z-0"
    :class="{
      'px-[10vw]': width >= 768,
      'px-[4vw]': width < 768,
    }"
  >
    <div class="text-[3rem] p-5 pt-12">AdoptAPaw</div>
    <div class="text-[1.5rem] p-5 text-center">
      Help provide a home to loving pets around the country
    </div>

    <!-- Center Cards-->
    <div
      class="grid grid-flow-col grid-cols-auto-fill justify-around mt-[2rem]"
      :class="{
        'grid-rows-1 gap-4': width >= 1000,
        'grid-rows-2 gap-2': width < 1000,
      }"
    >
      <NuxtLink
        v-for="(item, index) in cards"
        :key="index"
        :to="item.link"
        v-show="item.condition"
      >
        <div
          class="flex m-2 items-center justify-center bg-slate-200 flex-col text-xl font-bold"
          :class="{
            'size-[12rem]': width >= 768,
            'size-[14rem]': width >= 568 && width < 768,
            'size-[11.5rem]': width < 568 && width >= 450,
            'size-[8.75rem]': width < 450,
          }"
        >
          <img :src="item.img" alt="icon_image" class="size-3/4" />
          {{ item.label }}
        </div>
      </NuxtLink>
    </div>
  </div>
  <!-- #endregion -->
</template>
