<template>
  <div class="form-container">
    <h2>Update Pet Image</h2>

    <form @submit.prevent="handleFormSubmit">
      <div class="form-group">
        <label for="userId">Pet ID:</label>
        <input
          id="userId"
          v-model="userId"
          type="number"
          placeholder="Enter Pet ID"
          required
        />
      </div>

      <div class="form-group">
        <label for="petImage">New Pet Image:</label>
        <input
          id="petImage"
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          required
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Uploading..." : "Update Image" }}
      </button>
    </form>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUploadImage } from "@/composables/useUploadImage"; // Adjust path as needed

const userId = ref(""); // Store the pet ID input
const selectedFile = ref(null); // Store selected image file
const successMessage = ref(""); // Store success message
const errorMessage = ref(""); // Store error message
const isLoading = ref(false); // Track loading state
const fileInput = ref(null); // Ref to reset file input after form submission
const { uploadImage } = useUploadImage();

// Handle file input change
const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files[0]) {
    selectedFile.value = files[0];
  }
};

// Handle form submission
const handleFormSubmit = async () => {
  if (!userId.value || !selectedFile.value) {
    errorMessage.value = "Please provide both User ID and image.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    uploadImage("profile_pictures", selectedFile.value, userId.value, "users");

    successMessage.value = "User image updated successfully!";
    userId.value = ""; // Reset pet ID input
    selectedFile.value = null; // Reset selected file
    fileInput.value.value = ""; // Reset file input
  } catch (error) {
    errorMessage.value = error.message || "An error occurred.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  margin-top: 16px;
  color: green;
}

.error-message {
  margin-top: 16px;
  color: red;
}
</style>
