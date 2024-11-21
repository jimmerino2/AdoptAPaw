<script setup>
const client = useSupabaseClient();

const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const successMsg = ref(null);

definePageMeta({
  layout: "forms",
});

async function signUp() {
  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    successMsg.value = "Check your email to confirm your account.";
  } catch (error) {
    errorMsg.value = error.message;
  }
}
</script>

<template>
  <Card class="w-[90%] max-w-[576px] h-fit">
    <CardHeader>
      <CardTitle class="text-center">Sign Up</CardTitle>
    </CardHeader>
    <form @submit.prevent="signUp">
      <CardContent class="max-w-[450px] justify-self-center grow w-[90%]">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your password"
            required
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm mb-4 grow">
          {{ errorMsg }}
        </p>
        <p v-if="successMsg" class="text-green-800 text-sm mb-4 grow">
          {{ successMsg }}
        </p>
      </CardContent>
      <CardFooter class="w-full inline-block">
        <div class="justify-center flex grow">
          <button
            type="submit"
            class="w-[80%] max-w-[225px] py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </div>
      </CardFooter>
    </form>
  </Card>
</template>
