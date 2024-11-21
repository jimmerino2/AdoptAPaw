<script setup>
import Header from "./header.vue";
import Footer from "./footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="grow">
      <slot />
    </div>
    <Footer />
  </div>
</template>
