<template>
  <header class="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 fixed ">
    <!-- Brand -->
    <div class="text-lg font-bold">Sales App</div>

    <!-- Search Bar -->
    <div class="relative w-1/3">
      <input
        type="text"
        placeholder="Search..."
        class="w-full p-2 border rounded"
        v-model="searchQuery"
      />
      <button class="absolute right-2 top-2" @click="search">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4">
      <button @click="toggleTheme">
        <i class="fas fa-adjust"></i>
      </button>
      <button @click="toggleViewMode">
        <i class="fas" :class="viewMode === 'card' ? 'fa-th' : 'fa-table'"></i>
      </button>
      <div class="relative">
        <button @click="toggleNotifications">
          <i class="fas fa-bell"></i>
          <span v-if="notifications.length" class="text-sm text-red-500">
            {{ notifications.length }}
          </span>
        </button>
        <div
          v-if="showNotifications"
          class="absolute right-0 bg-white shadow-lg rounded p-4 w-64"
        >
          <p v-if="!notifications.length">No notifications</p>
          <ul>
            <li v-for="notification in notifications" :key="notification.id">
              {{ notification.message }}
            </li>
          </ul>
        </div>
      </div>
      <button>
        <i class="fas fa-user-circle"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref(""); // Reactive variable for search input
const notifications = [
  { id: 1, message: "John Doe reached his sales target!" },
  { id: 2, message: "New sales report available." },
];
const showNotifications = ref(false); // Reactive variable to toggle notifications
const viewMode = ref("card"); // Default view mode

const search = () => {
  console.log("Searching for:", searchQuery.value);
  // Add search logic here
};

const toggleTheme = () => {
  document.body.classList.toggle("dark-mode");
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "card" ? "table" : "card";
};
</script>

<style scoped>
aside {
  transition: width 0.3s ease-in-out;
}
nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
nav ul li {
  display: flex;
  align-items: center;
  gap: 10px;
}
nav ul li i {
  font-size: 1.2em;
}
</style>


