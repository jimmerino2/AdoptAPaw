<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

const images = [
  {
    title: "Donation Wallpaper 1",
    image: "/donation_wallpaper01.jpg",
    link: "https://www.purina.com.au/dw/image/v2/BKFD_PRD/on/demandware.static/-/Sites-Purina_AU-Library/default/dw3fd9359b/images/Finding-a-pet/Pet-advice/Cat-article/care-cat/benefits-of-cat-ownership.jpg",
  },
  {
    title: "Donation Wallpaper 2",
    image: "/donation_wallpaper02.jpg",
    link: "https://images-ext-1.discordapp.net/external/-8CBJzwhs_9dr_Q9-dyhxYMNiTcXxu4hzoFUtJ3ZmaQ/%3Fv%3D1692092090/https/mypetmatters.co.uk/cdn/shop/articles/Cat-lover.jpg?format=webp&width=1340&height=670",
  },
  {
    title: "Tips Wallpaper",
    image: "/wallpaper_tips.jpg",
    link: "https://static.vecteezy.com/system/resources/thumbnails/038/973/327/small_2x/ai-generated-little-cute-puppy-old-dog-golden-retriever-walks-in-the-park-on-a-walk-in-the-summer-at-sunset-photo.jpg",
  },

  {
    title: "Default Profile Icon",
    image: "/profile-icon.png",
    link: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  {
    title: "Homepage Icon",
    image: "/wallpaper_about.jpg",
    link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fman-hugging-dog&psig=AOvVaw2GTT6xzo6grqfnWxMBlwkf&ust=1737169210794000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCYzt_h-4oDFQAAAAAdAAAAABAE",
  },
];
</script>

<template>
  <div class="scaling">
    <div
      class="grid"
      :class="{
        'grid-cols-2': width >= 768,
        'grid-cols-3': width >= 1200,
      }"
    >
      <div class="flex flex-col items-center my-4" v-for="item in images">
        <p class="text-2xl font-bold">{{ item.title }}</p>
        <img :src="item.image" class="max-w-[300px] bg-black" />
        <NuxtLink :to="item.link" class="text-lg underline">
          Link to image
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
