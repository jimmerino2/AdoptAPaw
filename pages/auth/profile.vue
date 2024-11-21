<script setup>
definePageMeta({
  middleware: ["auth"],
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    router.push("/homepage");
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="user-dashboard">
    <!-- Display User Email -->
    <div v-if="user" class="mb-4 text-lg">
      <p>Welcome, {{ user.email }}</p>
    </div>

    <!-- Logout Button -->
    <div>
      <button
        @click="logout"
        type="button"
        class="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Styling for the user dashboard */
.user-dashboard {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
}
</style>
