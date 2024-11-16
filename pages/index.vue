<script>
export default {
  async asyncData({ redirect }) {
    // Server-side redirection
    redirect("/homepage");
  },
  mounted() {
    // Client-side redirection
    this.$router.push("/homepage");
  },
};
</script>
