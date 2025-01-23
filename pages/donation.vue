<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
</script>

<template>
  <!-- Top Screen -->
  <div
    class="flex items-center w-full"
    :class="{ 'bg-image justify-end min-h-[45vh]': width >= 768 }"
  >
    <!-- Desktop View -->
    <div
      v-show="width >= 1024"
      class="bg-orange-200 relative p-5 my-10 w-[35%] right-10"
    >
      <p class="text-xl p-2">Help the Website</p>
      <br />
      <p class="text-md p-2">
        As the website is run purely by donations, we would really appreciate
        any form of support you can give us!
        <br />
        This can include online banking or promoting your own pets up for
        adoption on the website, as well as adopting existing listings from both
        individuals and shelters!
      </p>
    </div>

    <!-- Mobile View -->
    <div v-show="width < 1024" class="text-center bg-orange-200 pb-4">
      <img src="/public/donation_wallpaper02.jpg" />
      <div class="p-2 flex flex-col items-center justify-center">
        <p class="text-xl py-2">Help the Website</p>
        <p class="text-md w-11/12">
          As the website is run purely by donations, we would really appreciate
          any form of support you can give us!
          <br />
          This can include online banking or promoting your own pets up for
          adoption on the website, as well as adopting existing listings from
          both individuals and shelters!
        </p>
      </div>
    </div>
  </div>

  <!-- How to Help -->
  <div class="bg-beige-100 scaling py-4">
    <div class="w-full text-center text-3xl font-bold py-2">
      How You Can Help
    </div>
    <div
      :class="{
        'grid grid-cols-3': width >= 768,
      }"
    >
      <div
        v-for="x in content"
        class="bg-beige-100 rounded-md flex flex-col items-center justify-self-center py-4 m-2 max-w-[300px]"
      >
        <p class="text-2xl text-center font-bold">{{ x.title }}</p>
        <p class="text-center">{{ x.desc }}</p>
        <img :src="x.img" alt="Image description" class="size-48 m-2" />
        <Button as-child class="bg-orange-600 hover:bg-orange-500"
          ><NuxtLink :to="x.link">Learn More</NuxtLink></Button
        >
      </div>
    </div>
  </div>

  <!-- TNG Area-->
  <div class="scaling py-4 bg-orange-200">
    <p class="font-bold text-xl justify-self-center" v-show="width < 576">
      Donate to help our website
    </p>
    <div :class="{ 'grid grid-cols-2': width >= 576 }">
      <img
        src="/public/tng_qr.png"
        id="qr"
        class="justify-self-center"
        :class="{
          'max-w-72': width < 576,
          'max-w-64': width >= 576 && width < 768,
          'max-w-96': width >= 768,
        }"
      />
      <div class="p-8">
        <p
          class="text-xl font-bold py-2"
          :class="{ 'text-center': width < 576 }"
        >
          Donate to Our Site
        </p>
        <p class="text-lg py-2" :class="{ 'text-center': width < 576 }">
          Any donations will go directly to the development of the website and
          shelters we work together with.
        </p>
        <img src="/public/donation_wallpaper02.jpg" />
      </div>
    </div>
  </div>
  <!-- #endregion -->
</template>

<script>
export default {
  data() {
    return {
      content: [
        {
          title: "Adopt",
          desc: "Adopt one of the pets posted by shelters or individuals",
          img: "/homepage_adopt.png",
          link: "/adoption/listings",
        },
        {
          title: "Rehome",
          desc: "Foster and provide homes for strays you see on the road",
          img: "/homepage_shelter.png",
          link: "/agent/shelters",
        },
        {
          title: "Donate",
          desc: "Donate to shelters or websites to support the cause",
          img: "/homepage_donate.png",
          link: "/donation#qr",
        },
      ],
    };
  },
};
</script>

<style>
@media (min-width: 768px) {
  .bg-image {
    background-image: url("/public/donation_wallpaper01.jpg");
  }
}

@media (max-width: 768px) {
  .bg-image {
    background-image: url("/public/donation_wallpaper02.jpg");
  }
}

.bg-image {
  background-size: cover;
  background-position: center;
}
</style>
