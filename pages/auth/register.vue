<script setup>
import { useFormValidation } from "~/composables/useFormValidation";

const { valContact } = useFormValidation();
const client = useSupabaseClient();

definePageMeta({
  layout: "forms",
});

const errorMsg = ref(null);
const successMsg = ref(null);
const formData = ref({
  name: "",
  email: "",
  password: "",
  contact: "",
});

async function signUp() {
  try {
    // Reset any previous messages
    errorMsg.value = null;
    successMsg.value = null;

    if (!valContact(formData.value.contact)) {
      errorMsg.value = "Invalid Contact Number";
    } else {
      // 1. Sign up account
      const { error } = await client.auth.signUp({
        email: formData.value.email,
        password: formData.value.password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/email_verification",
        },
      });
      if (error) throw error;

      await storeUnverifiedUserData();
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
}

async function storeUnverifiedUserData() {
  try {
    // Check if the email already exists in the users table
    const { data: existingUser, error: fetchError } = await client
      .from("users")
      .select("*")
      .eq("email", formData.value.email)
      .single();

    // Handle case where no user is found for the given email
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingUser) {
      errorMsg.value =
        "Email is already registered or pending for verification.";
    } else {
      // Insert the new user data, including the authenticated userId
      const { error } = await client.from("users").insert([
        {
          name: formData.value.name,
          email: formData.value.email,
          contact: formData.value.contact,
          verified: false,
        },
      ]);

      if (error) throw error;
      successMsg.value = "Check your email for verification.";
    }
  } catch (error) {
    successMsg.value = "";
    if (
      error.message ==
      `duplicate key value violates unique constraint "users_email_key"`
    ) {
      errorMsg.value = "Email is already pending for verification.";
    } else {
      errorMsg.value = error.message;
    }
  }
}

const inputList = [
  {
    label: "Username",
    type: "text",
    id: "name",
    placeholder: "Enter your username",
    model: "name", // Used for v-model binding
  },
  {
    label: "Email",
    type: "email",
    id: "email",
    placeholder: "Enter your email",
    model: "email", // Used for v-model binding
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    placeholder: "Enter your password",
    model: "password",
  },
  {
    label: "Contact Number",
    type: "tel",
    id: "contact",
    placeholder: "Enter your contact number",
    model: "contact",
  },
];
</script>

<template>
  <Card class="w-[90%] max-w-[576px] h-fit">
    <CardHeader>
      <CardTitle class="text-center">Sign Up</CardTitle>
    </CardHeader>
    <form @submit.prevent="signUp">
      <CardContent class="max-w-[450px] justify-self-center grow w-[90%]">
        <div v-for="item in inputList" :key="item.id" class="mb-4">
          <label :for="item.id" class="block text-sm font-medium">
            {{ item.label }}
          </label>
          <input
            v-model="formData[item.model]"
            :type="item.type"
            :id="item.id"
            :placeholder="item.placeholder"
            class="mt-1 p-2 border border-gray-300 rounded w-full"
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
