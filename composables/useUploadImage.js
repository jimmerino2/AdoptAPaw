export function useUploadImage() {
  const client = useSupabaseClient();

  const isValidUrl = (url) => {
    try {
      new URL(url); // Try creating a URL object
      return true;
    } catch (e) {
      return false;
    }
  };

  const uploadToBucket = async (folder, file, id) => {
    try {
      if (!folder || !file || !id) {
        throw new Error("Invalid arguments provided to uploadToBucket.");
      }

      let filePath;
      let fileData;

      // Check if URL
      if (typeof file === "string" && isValidUrl(file)) {
        // Fetch the image from the URL
        const response = await fetch(file);
        if (!response.ok)
          throw new Error(`Failed to fetch image from URL: ${file}`);

        // Convert the image to a Blob
        const blob = await response.blob();
        fileData = new File([blob], `${folder}_${id}_${Date.now()}.jpg`, {
          type: blob.type,
        });

        // Generate the file path
        filePath = `${folder}/${id}/${folder}_${id}_${Date.now()}.jpg`;
      } else {
        const fileExtension = file.name.split(".").pop();
        const customFileName = `${folder}_${id}_${Date.now()}.${fileExtension}`;
        filePath = `${folder}/${id}/${customFileName}`;
        fileData = file;
      }

      // Insert Image into Supabase Bucket
      const { data, error } = await client.storage
        .from("images")
        .upload(filePath, fileData, {
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
    column = "imagepath",
    deleteHistory = true
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
          .update({ [column]: filePath })
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
