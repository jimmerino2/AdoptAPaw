<script setup>
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();

const accordionItems = [
  {
    label: "Adoption Process",
    content: [
      {
        label: "How many listings can I apply for?",
        content:
          "Currently, you can apply for any amount of listings, however you may not apply for one with an already submitted application.",
      },
      {
        label: "Where do I make the payment?",
        content:
          "As this website is a nonprofit website, payments will be handled privately with the agent or shelter.",
      },
      {
        label: "Where do I find favorited pets?",
        content:
          "They can be found by entering your profile and 'View Favorites'.",
      },
    ],
  },
  {
    label: "Tips for Pets",
    content: [
      {
        label: "What should I prepare before adopting a pet?",
        content:
          "Food and water, as well as toys and litter boxes or leashes depending on the type of pet.",
      },
      {
        label: "Do I need to bring the pet to checkups after adopting?",
        content:
          "While agents may state the pet is vaccinated and sterilised, routine health checkups would be beneficial for your pet regardless.",
      },
      {
        label: "How will I know which pet to adopt that fits my lifestyle?",
        content:
          "All pets listed here have a story to tell, as well as distinct personalities. Find one that may complement your lifestyle or has a story that resonates with you!",
      },
    ],
  },
  {
    label: "Agent Accounts",
    content: [
      {
        label: "How do I register an agent account?",
        content:
          "You can head to the Shelters page and register as one. Once submitted, our admins will verify and authenticate your application.",
      },
      {
        label: "How many listings can I post on the account?",
        content:
          "You can post as many as you like as long as they are not faulty, as we do not wish to limit the amount of pets able to find new homes.",
      },
      {
        label: "Where can I add listings for the account?",
        content:
          "Head over to the Posts page, which allows you to view, edit and delete all listings grouped by whether they have been adopted.",
      },
    ],
  },
  {
    label: "Supporting the Website",
    content: [
      {
        label: "How can I help support the website?",
        content:
          "You can donate to the website via the donate page, or simply adopt and care for the strays on our listings page.",
      },
      {
        label: "Where do I find the shelters featured?",
        content:
          "You can find them in the Shelters page, which includes accounts from various caretakers.",
      },
      {
        label: "Where do the funds donated go to?",
        content:
          "They will be used to keep the website hosted, as well as donated to various shelters.",
      },
    ],
  },
];
</script>

<template>
  <!-- Top -->
  <div class="max-h-[400px] overflow-hidden bg-amber-900 relative">
    <img src="/wallpaper_tips.jpg" class="w-full opacity-60" />
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-full px-2"
    >
      <p
        class="text-center py-2"
        :class="{
          'text-2xl': width < 768,
          'text-3xl': width < 1024 && width >= 768,
          'text-4xl': width >= 1024,
        }"
      >
        FAQ Section
      </p>
      <p
        class="text-center py-2"
        :class="{
          'text-base': width < 768,
          'text-lg': width < 1024 && width >= 768,
          'text-xl': width >= 1024,
        }"
      >
        Learn more about how to use the website or handle pets
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="scaling flex flex-col items-center py-6 min-h-[500px]">
    <Accordion
      type="single"
      collapsible
      class="w-full overflow-hidden rounded-lg"
      default-value="Adoption Process"
    >
      <AccordionItem
        v-for="(item, index) in accordionItems"
        :key="index"
        :value="item.label"
      >
        <AccordionTrigger
          class="px-3 hover:no-underline"
          :class="{
            'bg-amber-500 hover:bg-amber-400': index % 2 === 0,
            'bg-orange-500 hover:bg-orange-400': index % 2 === 1,
          }"
        >
          {{ item.label }}
        </AccordionTrigger>
        <AccordionContent class="p-0">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="(child, childIndex) in item.content"
              :key="childIndex"
              :value="child.label"
            >
              <AccordionTrigger
                class="px-3 hover:no-underline"
                :class="{
                  'bg-beige-300 hover:bg-beige-200': childIndex % 2 === 0,
                  'bg-orange-200 hover:bg-orange-100': childIndex % 2 === 1,
                }"
                >{{ child.label }}</AccordionTrigger
              >
              <AccordionContent
                class="p-3 bg-beige-100 border-x border-beige-200"
                >{{ child.content }}</AccordionContent
              >
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
