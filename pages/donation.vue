<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
</script>

<template>
  <Header />
  <!-- Top Section -->
  <div
    class="bg-image min-h-[60vh] flex items-center"
    :class="{ 'justify-end': width >= 768 }"
  >
    <!-- Desktop View -->
    <div
      v-show="width >= 768"
      class="bg-slate-200 relative p-5 my-10 w-[35%] right-10"
    >
      <p class="text-lg">Title</p>
      <br />
      <p class="text-md">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur."
      </p>
      <Button class="my-4">Donate Today!</Button>
    </div>

    <!-- Mobile View -->
    <div v-show="width < 768" class="w-full text-center bg-slate-200">
      <img src="/assets/images/donation_wallpaper02.jpg" />
      <div class="p-8">
        <p class="text-lg">Title</p>
        <br />
        <p class="text-md">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur."
        </p>
      </div>
      <Button class="my-4">Donate Today!</Button>
    </div>
  </div>

  <Footer />
</template>

<style>
@media (min-width: 768px) {
  .bg-image {
    background-image: url("/assets/images/donation_wallpaper01.jpg");
  }
}

@media (max-width: 768px) {
  .bg-image {
    background-image: url("/assets/images/donation_wallpaper02.jpg");
  }
}

.bg-image {
  background-size: cover;
  background-position: center;
}
</style>
