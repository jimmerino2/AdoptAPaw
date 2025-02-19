<script setup>
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();

const links = [
  {
    link: "https://github.com/jimmerino2/AdoptAPaw",
    img: "/github.png",
    content: "To Project Github",
  },
  {
    link: "https://github.com/jimmerino2",
    img: "/profile-icon.png",
    content: "About Me",
  },
];
</script>

<template>
  <div class="flex flex-col bg-orange-700 scaling opacity-90 py-2">
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex items-center">
        <p class="text-sm mx-4">
          ©2025 AdoptAPaw.com
          <span v-if="width >= 576"> | </span><span v-else><br /></span>
          <NuxtLink to="/credits">
            <span class="text-sm underline">All images credited here</span>
          </NuxtLink>
        </p>
      </div>
      <div class="flex items-center">
        <TooltipProvider v-for="i in links">
          <Tooltip>
            <TooltipTrigger>
              <NuxtLink :to="i.link">
                <img
                  :src="i.img"
                  class="size-8 ml-4 rounded-full bg-orange-500"
                />
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent>{{ i.content }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
</template>
