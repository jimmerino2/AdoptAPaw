<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
</script>

<template>
  <Header />
  <!-- #region Top Screen -->
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
    <div v-show="width < 768" class="w-full text-center bg-slate-200 pb-4">
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
      <Button>Donate Today!</Button>
    </div>
  </div>
  <!-- #endregion -->

  <!-- #region Why to Donate -->
  <div
    class="bg-slate-200 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] py-4"
  >
    <div
      :class="{
        '': width < 400,
        'grid grid-cols-2': width >= 576,
        'grid grid-cols-4': width >= 1000,
      }"
    >
      <div v-for="x in content" class="justify-self-center m-2">
        <p class="text-lg text-center font-bold">{{ x.title }}</p>
        <p class="text-md text-center h-16">{{ x.desc }}</p>
        <img
          :src="x.img"
          alt="Image description"
          class="bg-zinc-300 size-48 m-2 justify-self-center"
        />
      </div>
    </div>
  </div>
  <!-- #endregion -->

  <!-- #region TNG Area-->
  <div class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] py-4">
    <p class="font-bold text-xl justify-self-center" v-show="width < 576">
      Donate to help our website
    </p>
    <div :class="{ 'grid grid-cols-2': width >= 576 }">
      <img
        src="/assets/images/donation_qr.jpg"
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
        <img src="/assets/images/donation_wallpaper02.jpg" />
      </div>
    </div>
  </div>
  <!-- #endregion -->

  <Footer />
</template>

<script>
export default {
  data() {
    return {
      content: [
        { title: "Title 1", desc: "Description 1", img: "/path/to/image1.jpg" },
        {
          title: "Title 2",
          desc: "Description 2Description 2Description 2Description 2Description 2Description 2",
          img: "/path/to/image2.jpg",
        },
        { title: "Title 3", desc: "Description 3", img: "/path/to/image3.jpg" },
        { title: "Title 4", desc: "Description 4", img: "/path/to/image3.jpg" },
      ],
    };
  },
};
</script>

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
