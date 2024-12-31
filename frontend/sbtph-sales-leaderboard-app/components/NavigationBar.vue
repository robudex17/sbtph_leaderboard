<template>
  <header class="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 fixed">
    <!-- Brand -->
    <div class="flex items-center gap-10">
      <div class="text-lg font-bold">Sales App</div>

      <!-- Dropdown for Month and Year -->
      <div class="flex items-center gap-2">
        <select
          v-model="selectedMonth"
          class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Select Month</option>
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <select
          v-model="selectedYear"
          class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Select Year</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          @click="submitDateSelection"
        >
          Submit
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative w-1/3">
      <input
        type="text"
        placeholder="Search..."
        class="w-full p-2 border rounded"
        v-model="searchQuery"
      />
      <button class="absolute right-2 top-2 text-gray-500 hover:text-gray-700" @click="search">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-6">
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
import { ref, watch } from "vue";

const searchQuery = ref("");
const notifications = [
  { id: 1, message: "John Doe reached his sales target!" },
  { id: 2, message: "New sales report available." },
];
const showNotifications = ref(false);
const viewMode = ref("card");
const selectedMonth = ref("");
const selectedYear = ref("");
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

const router = useRouter()
const route = useRoute()

const search = () => {
  console.log("Searching for:", searchQuery.value);
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

const submitDateSelection = () => {
  if (selectedMonth.value && selectedYear.value) {
    const currentRoute = router.currentRoute.value;
    router.push({
      path: currentRoute.path,
      query: { ...currentRoute.query, month: selectedMonth.value, year: selectedYear.value },
    });
    console.log(`Redirecting to: ${currentRoute.path} with Month: ${selectedMonth.value}, Year: ${selectedYear.value}`);
  } else {
    alert("Please select both a month and a year.");
  }
};

//If Click I to other menu  selectedMonth and selectedYear will be empty
watch(route, (newRoute)=> {
  console.log(newRoute.query)
  if (Object.keys(newRoute.query).length == 0) {
      selectedMonth.value = ""
       selectedYear.value =  ""
  }
 
})




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
