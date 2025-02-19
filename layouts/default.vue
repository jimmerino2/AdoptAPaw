<script setup>
import Header from "../composables/header.vue";
import Footer from "../composables/footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header class="z-30" />
    <div class="grow bg-beige-100">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style>
body {
  font-family: "Nexa Regular", sans-serif;
}
</style>
