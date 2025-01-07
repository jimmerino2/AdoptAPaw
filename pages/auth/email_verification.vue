<script setup>
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();

console.log(user.value.email);

onMounted(async () => {
  try {
    // Ensure `user` is available and has an email
    if (!user.value || !user.value.email) {
      console.warn("User is not authenticated or email is missing.");
      return;
    }

    // Update the 'verified' column to true and user_id
    const { error: updateError } = await client
      .from("users")
      .update({ verified: true, user_id: user.value.id })
      .eq("email", user.value.email);

    if (updateError) {
      console.error("Error updating user:", updateError);
    } else {
      console.log("User verified successfully!");
      router.push("/homepage");
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
});
</script>

<template></template>
