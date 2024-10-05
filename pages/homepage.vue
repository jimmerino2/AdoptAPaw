<script setup lang="ts">
import Header from '~/components/layout/Header.vue';

</script>

<template>
  <Header />
  <div>
        <div v-for="index in 100" :key="index">
            Hello World {{ index }}
        </div>
    </div>
</template>

<style>
  body{
    margin:0px;
    }
</style>