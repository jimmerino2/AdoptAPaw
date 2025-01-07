export default defineNuxtRouteMiddleware(async () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();

  if (user.value) {
    const { data } = await client
      .from("users")
      .select("*")
      .eq("user_id", user.value.id)
      .single();
    if (data.role !== "Agent") {
      router.push("/homepage");
    }
  }
});
