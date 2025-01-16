<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
</script>

<template>
  <!-- Navigation -->
  <div
    class="flex bg-zinc-400 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
  >
    <div class="flex-grow p-2">
      <!-- Logo -->
      <div class="flex flex-row text-lg items-center">
        <img src="" alt="logo" class="size-16 border border-black mr-4" />
        AdoptAPaw
      </div>

      <!-- Content -->
      <div
        class="border border-black my-2"
        :class="{ 'grid grid-cols-7 items-top p-4': width >= 768 }"
      >
        <!-- Links -->
        <div
          :class="{
            'col-span-3 flex flex-row': width >= 768,
            'flex flex-col items-start p-2 w-full': width < 768,
          }"
        >
          <div
            v-for="item in list"
            class="flex-grow text-md"
            :class="{
              'border border-black w-[100%] group relative': width < 768,
              'flex-grow text-md': width >= 768,
            }"
          >
            <p class="text-lg">{{ item.title }}</p>
            <ul :class="{ 'group-hover:block hidden': width < 768 }">
              <li v-for="content in item.content">{{ content }}</li>
            </ul>
          </div>
        </div>

        <!-- Donation -->
        <div
          class="bg-zinc-200 col-span-4 rounded-lg mx-4 px-10 flex items-center justify-center flex-col my-4"
        >
          <div class="text-lg m-2 text-center">
            Make a donation to the website!
          </div>
          <div class="text-md text-center">
            Help our website find their forever homes by donating to our
            organzation!
          </div>
          <Button class="m-5">To Donate Page</Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Copyright and Links-->
  <div
    class="flex bg-zinc-500 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
  >
    <div class="flex-grow flex justify-between px-2">
      <div class="">Copyright yada yada</div>
      <div class="">
        <a href="https://github.com/jimmerino2/AdoptAPaw"><div>Github</div></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: "Title 1",
          content: ["Item 1", "Item 2", "Item 3"],
          links: [],
        },
        {
          title: "Title 2",
          content: ["Item 1", "Item 2", "Item 3"],
          links: [],
        },
        {
          title: "Title 3",
          content: ["Item 1", "Item 2", "Item 3"],
          links: [],
        },
      ],
    };
  },
};
</script>
