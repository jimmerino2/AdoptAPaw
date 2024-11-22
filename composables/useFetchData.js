export function useFetchData() {
  const client = useSupabaseClient();

  async function fetchData(table, conditions = "*") {
    try {
      // Fetch data from the Supabase table
      const { data, error } = await client.from(table).select(conditions);

      if (error) {
        throw new Error(`Error fetching data from ${table}: ${error.message}`);
      }

      return data; // Return the resolved array
    } catch (err) {
      console.error(err.message);
      return null; // Return null or handle the error appropriately
    }
  }

  return { fetchData };
}
