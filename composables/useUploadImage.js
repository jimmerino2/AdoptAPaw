export function useUploadImage() {
  const client = useSupabaseClient();

  const uploadToBucket = async (folder, file, id) => {
    try {
      if (!folder || !file || !id) {
        throw new Error("Invalid arguments provided to uploadToBucket.");
      }

      // Generate File Name and Path
      const fileExtension = file.name.split(".").pop();
      const customFileName = `${folder}_${id}_${Date.now()}.${fileExtension}`;
      const filePath = `${folder}/${id}/${customFileName}`;

      // Insert Image into Supabase Bucket
      const { data, error } = await client.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600", // Cache for 1 hour
          upsert: true, // Overwrite if file exists
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      console.log("Image uploaded successfully");
      return filePath;
    } catch (err) {
      console.error(`Error in uploadToBucket: ${err.message}`);
      return null;
    }
  };

  const uploadImage = async (
    folder,
    file,
    id,
    tableName,
    saveToDb = true,
    deleteHistory = false
  ) => {
    try {
      if (!folder || !file || !id || !tableName) {
        throw new Error("Invalid arguments provided to uploadImage.");
      }

      if (deleteHistory) {
        await removePreviousImages(folder, id);
      }

      // Upload Image to Bucket
      const filePath = await uploadToBucket(folder, file, id);

      if (!filePath) {
        throw new Error(`Failed to upload image for ID ${id}.`);
      }

      // Save File Path to the Database
      if (saveToDb) {
        await client
          .from(tableName)
          .update({ imagepath: filePath })
          .eq("id", id);
      }

      return filePath;
    } catch (err) {
      console.error(`Error in uploadImage: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const removePreviousImages = async (folder, id) => {
    const bucket = "images";
    const folderPath = `${folder}/${id}/`;

    const { data: listData, error: listError } = await client.storage
      .from(bucket)
      .list(folderPath);

    if (listError) {
      console.warn("Error listing files:", listError.message);
    } else if (listData?.length) {
      const filesToDelete = listData.map((file) => `${folderPath}${file.name}`);
      const { error: deleteError } = await client.storage
        .from(bucket)
        .remove(filesToDelete);

      if (deleteError) {
        console.warn("Error deleting files:", deleteError.message);
      } else {
        console.log("Previous images deleted successfully.");
      }
    }
  };

  return { removePreviousImages, uploadImage };
}
