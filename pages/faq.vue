<script setup lang="ts">
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue';

</script>

<template>
  <Header />
  <div v-for="n in 12">
    <div>Hello World</div>
  </div>
  <Footer />
</template>