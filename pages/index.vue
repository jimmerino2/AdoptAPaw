<template>
    <h1 class="text-2xl">Hello World!</h1>
    <NuxtLink to="/homepage">To homepage</NuxtLink>
</template>

<style>

</style>

<script>
export default {
  async asyncData({ redirect }) {
    // Server-side redirection
    redirect('/homepage');  
  },
  mounted() {
    // Client-side redirection 
    this.$router.push('/homepage');
  }
}
</script>