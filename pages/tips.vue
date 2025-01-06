<template>
  <div class="dropdown">
    <input
      type="text"
      placeholder="--:-- --"
      v-model="searchTerm"
      @focus="showDropdown = true"
      @input="filterOptions"
      @blur="hideDropdown"
    />
    <ul v-if="showDropdown" class="dropdown-list">
      <li
        v-for="option in filteredOptions"
        :key="option"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Generate 24-hour time options with 15-minute intervals
const options = [];
const intervals = 15;
for (let hour = 0; hour < 24; hour++) {
  for (let minutes = 0; minutes < 60; minutes += intervals) {
    const displayHour = hour.toString().padStart(2, "0");
    const displayMinutes = minutes.toString().padStart(2, "0");
    options.push(`${displayHour}:${displayMinutes}`);
  }
}

const searchTerm = ref("");
const filteredOptions = ref(options);
const showDropdown = ref(false);

function filterOptions() {
  filteredOptions.value = options.filter((option) =>
    option.startsWith(searchTerm.value)
  );
}

function selectOption(option) {
  searchTerm.value = option;
  showDropdown.value = false;
}

function hideDropdown() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100); // Delay to allow click events to register
}
</script>

<style>
/* Style the dropdown container */
.dropdown {
  position: relative;
  display: inline-block;
  width: 200px;
}

/* Style the input field */
.dropdown input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Style the dropdown list */
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Style individual list items */
.dropdown-list li {
  padding: 8px;
  cursor: pointer;
}

.dropdown-list li:hover {
  background-color: #f0f0f0;
}
</style>
