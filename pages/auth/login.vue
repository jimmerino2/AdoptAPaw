<script setup>
const client = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref(null);
const errorMsg = ref(null);

definePageMeta({
  layout: "forms",
});

async function logIn() {
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    router.push("/homepage");
  } catch (error) {
    errorMsg.value = error.message;
  }
}
</script>

<template>
  <Card class="w-[90%] max-w-[576px] h-fit">
    <CardHeader>
      <CardTitle class="text-center">Sign In</CardTitle>
    </CardHeader>
    <CardContent class="max-w-[450px] justify-self-center grow w-[90%]">
      <NuxtLink to="/auth/register">
        <span class="underline">Don't have an account? Register instead.</span>
      </NuxtLink>
      <div class="my-4">
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
        <label for="password" class="block text-sm font-medium">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Enter your password"
          required
        />
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm mb-4 grow">
        {{ errorMsg }}
      </div>
    </CardContent>
    <CardFooter class="w-full inline-block">
      <div class="justify-center flex grow">
        <button
          @click="logIn"
          type="button"
          class="w-[80%] max-w-[225px] py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    </CardFooter>
  </Card>
</template>
