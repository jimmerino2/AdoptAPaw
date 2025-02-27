<script setup>
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();

console.log("User:", user.value);
console.log("Email:", user.value.email);

watchEffect(async () => {
  if (!user.value || !user.value.email) {
    console.warn("User is not authenticated or email is missing.");
    return;
  }

  try {
    console.log("User detected:", user.value.email);

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
