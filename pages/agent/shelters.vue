<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const client = useSupabaseClient(0);
const formData = ref({ name: "" });
const agentAccounts = ref();
filterName();

async function filterName() {
  const { data } = await client
    .from("users")
    .select("*")
    .eq("role", "Agent")
    .eq("verified", true)
    .ilike("name", "%" + formData.value.name + "%");
  agentAccounts.value = data;
}
</script>

<template>
  <div class="overflow-hidden max-h-[400px] bg-black relative">
    <img src="/wallpaper_shelter.jpg" class="w-full opacity-70 min-w-[500px]" />
    <div
      class="absolute top-1/2 left-1/2 text-white text-center transform -translate-x-1/2 -translate-y-1/2 w-full px-4"
    >
      <p class="text-4xl py-1">Find a Rescue</p>
      <p class="text-xl">
        Search for specific shelter accounts and support them by adopting or
        donating!
      </p>
    </div>
  </div>

  <div class="scaling flex flex-col items-center">
    <input
      type="text"
      placeholder="Enter Name"
      v-model="formData.name"
      class="w-full rounded-md p-2 mx-5 mt-5"
      @input="filterName"
    />
    <div
      class="grid"
      :class="{
        'grid-cols-1': width < 768,
        'grid-cols-2': width >= 768 && width < 1160,
        'grid-cols-3': width >= 1160 && width < 1600,
        'grid-cols-4': width >= 1600,
      }"
    >
      <div class="w-full flex justify-center" v-for="i in agentAccounts">
        <ProfilePreview :user="i" :showDetails="true" />
      </div>
    </div>
  </div>
</template>
