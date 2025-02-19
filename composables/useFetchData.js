export function useFetchData() {
  const client = useSupabaseClient();

  async function fetchData(table, cols = "*", condition1) {
    try {
      // Fetch data from the Supabase table
      if (condition1) {
        const { data, error } = await client
          .from(table)
          .select(cols)
          .eq(condition1[0], condition1[1])
          .order("id", { ascending: true });

        if (error) {
          throw new Error(
            `Error fetching data from ${table}: ${error.message}`
          );
        }

        return data; // Return the resolved array
      } else {
        const { data, error } = await client
          .from(table)
          .select(cols)
          .order("id", { ascending: true });
        if (error) {
          throw new Error(
            `Error fetching data from ${table}: ${error.message}`
          );
        }

        return data; // Return the resolved array
      }
    } catch (err) {
      console.error(err.message);
      return null; // Return null or handle the error appropriately
    }
  }

  function fetchImage(imagePath) {
    const config = useRuntimeConfig();
    const SUPABASE_URL = config.public.supabaseUrl;
    return `${SUPABASE_URL}/storage/v1/object/public/images/${imagePath}`;
  }

  async function fetchUser() {
    const client = useSupabaseClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    return user;
  }

  return { fetchImage, fetchData, fetchUser };
}
