<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
definePageMeta({
  middleware: ["auth", "agentaccept"],
});
</script>

<template>
  <div
    class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] pt-2 pb-10"
    :class="{ flex: width >= 1024 }"
  >
    <ProfileCard />
    <div
      class="grow rounded-md bg-slate-300"
      :class="{ 'mt-16': width >= 1024 }"
    >
      <div
        class="p-4 flex items-center flex-col w-full h-full bg-slate-100"
      ></div>
    </div>
  </div>
</template>
