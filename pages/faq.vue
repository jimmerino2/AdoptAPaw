<script setup>
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const defaultValue = "item-1";
</script>

<template>
  <!-- Intro Section -->
  <div :class="{ 'grid grid-cols-5': width >= 700 }">
    <img src="/public/faq_wallpaper01.png" class="col-span-2" />
    <div
      class="bg-slate-100 col-span-3 px-6 text-md flex flex-col justify-center"
      :class="{ hidden: width < 700 }"
    >
      <div
        class="text-2xl py-2 font-bold"
        :class="{ 'text-3xl': width >= 1200 }"
      >
        About Us
      </div>

      <div :class="{ 'text-xl py-2': width >= 1200 }">
        Our website aims to help pets around the country to find their forever
        homes, as well as provide space for existing shelters to handle more
        strays.
      </div>

      <div
        class="py-4"
        :class="{ hidden: width < 990, 'text-xl py-2': width >= 1200 }"
      >
        Ask questions personally by contacting us directly. We value your input
        more than anything.<br />
        <Button variant="as-child" class="bg-slate-400 my-4 p-6 text-lg">
          <NuxtLink to="/contact">Contact Us</NuxtLink>
        </Button>
      </div>
    </div>
  </div>

  <!-- FAQ Section -->
  <div class="p-2">
    <div class="text-center p-2">
      <p class="text-xl font-bold p-2" :class="{ 'text-2xl': width >= 900 }">
        FAQ Section
      </p>
      <p class="text-md" :class="{ 'text-xl': width >= 900 }">
        Learn more about the adoption process
      </p>
    </div>
    <Accordion
      type="single"
      class="custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw] m-4"
      collapsible
      :default-value="defaultValue"
    >
      <AccordionItem v-for="item in list" :key="item.value" :value="item.value">
        <AccordionTrigger>{{ item.title }}</AccordionTrigger>
        <AccordionContent>
          {{ item.content }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          value: "item-1",
          title: "Title 1",
          content: "Description 1",
        },
        {
          value: "item-2",
          title: "Title 2",
          content: "Description 1",
        },
        {
          value: "item-3",
          title: "Title 3",
          content: "Description 1",
        },
        {
          value: "item-4",
          title: "Title 4",
          content: "Description 1",
        },
      ],
    };
  },
};
</script>
