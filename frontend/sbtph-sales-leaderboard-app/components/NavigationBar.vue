<template>
  <header class="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 fixed">
    <!-- Brand -->
    <div class="flex items-center gap-10">
      <div class="text-lg font-bold">SBTPH SALES APP</div>

      <!-- Dropdown for Month and Year -->
      <div class="flex items-center gap-2">
        <select v-if="hasMonthOption"
          v-model="selectedMonth"
          class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="" >Select Month</option>
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-if="hasYearOption" 
          v-model="selectedYear"
          class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Select Year</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <select v-if="hasTrucksOption"
          class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="truckOption"
        >
          <option :value="true">With Trucks</option>
          <option :value="false">Without Trucks</option>
        </select>
        <button  v-if="hasYearOption" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          @click="submitDateSelection"
        >
          Submit
        </button>
      </div>
    </div>

<!-- User Profile -->
    <div class="relative flex items-center gap-2 cursor-pointer group">
      <p>
      <span class="font-semibold text-gray-700">Current User: </span>
      <span class="font-bold text-purple-800 uppercase"> {{ currentUser.username }}</span>
    
    </p> 
    <img 
          :src="currentUser.image_link" 
          alt="User Profile" 
          class="w-10 h-10 rounded-full border-2 border-gray-300"
      />
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
import { ref, watch,computed } from "vue";

//get the current user
const authStore = useAuthStore()
authStore.fetchTokenFromLocalStore()

const currentUser = authStore.state.user 

const searchQuery = ref("");
const notifications = [
  { id: 1, message: "John Doe reached his sales target!" },
  { id: 2, message: "New sales report available." },
];
const showNotifications = ref(false);
const viewMode = ref("card");
const selectedMonth = ref("");
const selectedYear = ref("");
const truckOption = ref(true) //default is  include the truck 
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);



const router = useRouter()
const route = useRoute()
const urlPath = ref(route.fullPath)

const pathWithoutMonthOption = ref([
  '/analytics/agents',
   '/analytics/market', 
   '/analytics/overall',
   '/admin/agent/manage_sales_agents', 
   '/admin/manage_standard_users',
   '/agent_performance/year',
   '/team_performance/year',
   '/feedback/feedback_by_qa',
   '/feedback/managers_feedback',
   '/feedback/agents_feedback',
   '/feedback/lm_feedback',
   '/dashboard/dashboard_year_view',
   '/agent_performance/analytics',
   '/team_performance/analytics'


])

const pathWithoutYearOption = ref([
   '/admin/agent/manage_sales_agents',
   '/admin/manage_standard_users',
   '/feedback/feedback_by_qa',
   '/feedback/managers_feedback',
   '/feedback/agents_feedback',
   '/feedback/lm_feedback',    
])

const pathWithoutTrucksOption = ref([
  '/admin/agent/manage_sales_agents',
   '/admin/manage_standard_users',
   '/feedback/feedback_by_qa',
   '/feedback/managers_feedback',
   '/feedback/agents_feedback',
   '/feedback/lm_feedback',
   '/agent_performance/analytics',
   '/agent_performance/month',
   '/agent_performance/year',

])

console.log(route.params.agent_id)


const hasYearOption  = computed(() =>{
  if(!pathWithoutYearOption.value.includes(route.path)  ){
    return true
  }else{
    return false
  }
})



const hasMonthOption = computed(() =>{
  if(!pathWithoutMonthOption.value.includes(route.path)){
    return true
  }else{
    return false
  }
})


const hasTrucksOption = computed(() =>{
  if(!pathWithoutTrucksOption.value.includes(route.path) && !route.path.includes('/admin/agent') && !route.path.includes('/feedback')){
    return true
  }else{
    return false
  }
})





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

const validateInputMonthAndYearDates = (month, year) => {
    const timestamp = Date.now()
    
    const date = new Date(timestamp)
      //  Extract year, month, and day
    const currentYear = date.getFullYear();
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const currentDay = date.getDate().toString().padStart(2, '0'); // Ensure two digits    
    
    //    current month and year timestamp
   const currentMonthYearTimestamp = new Date(`${currentYear}-${currentMonth}`).getTime()
  
   const givenMonthYearTimestamp = new Date(`${year}-${month}`).getTime() 

   if (givenMonthYearTimestamp > currentMonthYearTimestamp){
    return false
   }
   return true
}

const  validateInputYearDates = (year) => {
  const timestamp = Date.now()
    
    const date = new Date(timestamp)
      //  Extract year, month, and day
    const currentYear = date.getFullYear();
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const currentDay = date.getDate().toString().padStart(2, '0'); // Ensure two digits    
    
    //    current month and year timestamp
   const currentMonthYearTimestamp = new Date(`${currentYear}-${currentMonth}`).getTime()
  
   const givenMonthYearTimestamp = new Date(`${year}-${currentMonth}`).getTime() 

   if (givenMonthYearTimestamp > currentMonthYearTimestamp){
    return false
   }
   return true
}


const submitDateSelection = () => {
  if (route.path == '/analytics/agents' || 
      route.path == '/analytics/market' || 
      route.path == '/analytics/overall' || 
      route.path == '/agent_performance/year' || 
      route.path == '/team_performance/year' ||
      route.path == '/dashboard/dashboard_year_view' || 
      route.path == '/agent_performance/analytics' ||  
      route.path == '/team_performance/analytics'
    
    ){
    
    if (!validateInputYearDates(selectedYear.value)){
    alert('Cannot Select Year greater than current Year')
    return
    }
    if (selectedYear.value) {
      const currentRoute = router.currentRoute.value;
      router.push({
        path: currentRoute.path,
        query: { ...currentRoute.query, year: selectedYear.value,  withTrucks:truckOption.value },
      });
      
    } else {
      alert("Please select a year.");
    }
  }else{
    if (!validateInputMonthAndYearDates(selectedMonth.value, selectedYear.value)){
    alert('Cannot Select Month and Year greater than current Month and Year')
    return
    }
    if (selectedMonth.value && selectedYear.value) {
      const currentRoute = router.currentRoute.value;
      router.push({
        path: currentRoute.path,
        query: { ...currentRoute.query, month: selectedMonth.value, year: selectedYear.value, withTrucks:truckOption.value },
      });
      console.log(`Redirecting to: ${currentRoute.path} with Month: ${selectedMonth.value}, Year: ${selectedYear.value}`);
    } else {
      alert("Please select both a month and a year.");
    }
  }

};

//If Click I to other menu  selectedMonth and selectedYear will be empty
watch(route, (newRoute)=> {
  console.log(newRoute.query)
  urlPath.value = newRoute.fullPath

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
header {
  z-index: 10;
}
</style>
