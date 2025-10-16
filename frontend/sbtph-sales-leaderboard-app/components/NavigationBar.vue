<template>
    <div>
        <header class="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 fixed">
          <!-- Brand -->
          <div class="flex items-center gap-10">
              <div class="text-lg font-bold">SBTPH SALES APP</div>
              <!-- Dropdown for manage sales agent -->
              <div v-if="route.path =='/admin/agent2/manage_sales_agents'" class="flex items-center gap-2">
         
                <select 
                  class="px-2 py-1 border  font-bold text-sm rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 v-model="salesEmployementStatus"
                >
              
                <option class="text-green-500 font-bold" value="Hired">ACTIVE</option>
                <option  class="text-red-500 font-bold" value="Resigned">RESIGNED</option>

                </select>
                <button  
                  class="px-2 py-1 bg-blue-500 text-white rounded font-bold text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click="fetchSalesAgents"
                >
                  Submit
                </button>
              </div>                 

              <!-- Dropdown for Dashboard -->
              <div v-if="route.path =='/dashboard'" class="flex items-center gap-2">
         
                <select 
                  class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="dashboardOption"
                >
              
                <option v-for="dashboardoption in dashboardListOfOptions " :key="dashboardoption" :value="dashboardoption ">{{ dashboardoption.toUpperCase()  }}</option>

                </select>
                <button  
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click="submitDateSelection"
                >
                  Submit
                </button>
              </div>                 
              <!-- Dropdown for Month and Year -->
              <div v-else class="flex items-center gap-2">
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
                <select v-if="route.path == '/'"
                  class="p-2 border rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="leaderboardOption"
                >
              
                <option v-for="leaderboardOptions in ['agent', 'lm', 'team', 'new deposit']" :key="leaderboardOptions" :value="leaderboardOptions">{{ leaderboardOptions.toUpperCase()  }}</option>

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
                    :src="updateImageLink(currentUser.image_link)" 
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
    </div>
</template>

<script setup>
    import { ref, watch,computed } from "vue";

    //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()

    const currentUser = authStore.state.user 

    const config = useRuntimeConfig()

    const updateImageLink = (imageLink) => {
        return `${config.public.imageBaseUrl}${imageLink}`
      }

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
    

    // Dashboard values
    // const individual = 'individual'
    // const team = 'team'
    // const overall = 'overall'
    const dashboardOption = ref("")

    //if rustan is login  set  dashboardOption default value as team
    if( currentUser.agent_type == 2){
      dashboardOption.value = "team"
    }else{
      dashboardOption.value = "individual"
    }

  
    const leaderboardOption = ref('agent')

    const salesEmployementStatus = ref('Hired')



    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );
    // const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);

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
      '/feedback/feedback_by_sales',
      '/dashboard/dashboard_year_view',
      '/agent_performance/analytics',
      '/team_performance/analytics',
      '/admin/agent_performance/yearly',
      '/admin/upload_target_shipok_data',
       '/admin/upload_new_deposit_data',
       '/admin/upload_sales_evaluation_data',
       '/admin/markets_and_teams',

       '/admin/agent2/manage_sales_agents',
       '/overall_performance/year.vue',
      '/admin/overall_performance/yearly',
      '/admin/team_performance/yearly',
      '/overall_performance/year'


    ])

    const pathWithoutYearOption = ref([
      '/admin/agent/manage_sales_agents',
      '/admin/manage_standard_users',
      '/feedback/feedback_by_sales',
      '/admin/upload_target_shipok_data',
      '/admin/upload_new_deposit_data' ,
      '/admin/upload_sales_evaluation_data' ,
       '/admin/markets_and_teams',
       
       '/admin/agent2/manage_sales_agents',
    ])

    const pathWithoutTrucksOption = ref([
      '/admin/agent/manage_sales_agents',
      '/admin/manage_standard_users',
      '/feedback/feedback_by_qa',
      '/feedback/feedback_by_sales',
      '/agent_performance/analytics',
      '/agent_performance/month',
      '/agent_performance/year',
       '/admin/upload_target_shipok_data',
      '/admin/upload_new_deposit_data',
      '/admin/upload_sales_evaluation_data',
      '/admin/sales_evaluation',
      '/',
       '/admin/markets_and_teams',
       '/team_performance/year',


       '/admin/agent2/manage_sales_agents',
       '/admin/team_performance/monthly',
       '/admin/team_performance/yearly',
        '/team_performance/month',
       '/team_performance/yearl',
       '/admin/overall_performance/yearly',
       '/admin/overall_performance/monthly',
        '/overall_performance/year',
        '/overall_performance/month',


    ])


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

    const dashboardListOfOptions  = computed(()  => {
      if (currentUser.agent_type == 2) {
        return [ 'team', 'overall']
      }else{
        return [ 'individual', 'team', 'overall']
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

    const fetchSalesAgents = () => {
      if (route.path == '/admin/agent2/manage_sales_agents') {
         
          const currentRoute = router.currentRoute.value 

          router.push( {
             path: currentRoute.path,
             query: {
               employee_status: salesEmployementStatus.value
             } 

          })
      }
      return
    }
    const submitDateSelection = () => {

      if(route.path == '/dashboard'){
        
        const currentRoute = router.currentRoute.value;
        
        if (!['individual', 'team', 'overall'].includes(dashboardOption.value)  ) {
          alert("Dashboard option is invalid")
          return
        }

    
        router.push({
                path: currentRoute.path,
                query: {dashboardoption: dashboardOption.value },
        });        
      
        return
      }
      else if (route.path == '/analytics/agents' || 
          route.path == '/analytics/market' || 
          route.path == '/analytics/overall' || 
          route.path == '/agent_performance/year' || 
          route.path == '/team_performance/year' ||
          route.path == '/dashboard/dashboard_year_view' || 
          route.path == '/agent_performance/analytics' ||  
          route.path == '/team_performance/analytics' ||
          route.path == '/admin/agent_performance/yearly' ||
          route.path == '/admin/overall_performance/yearly' ||
          route.path == '/overall_performance/year' ||
          route.path == '/admin/team_performance/yearly'
        
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
            if(route.path == '/'){
              router.push({
              path: currentRoute.path,
              query: { ...currentRoute.query, month: selectedMonth.value, year: selectedYear.value, withTrucks:truckOption.value, leaderboardOption: leaderboardOption.value },
            });
            }else {
              router.push({
                path: currentRoute.path,
                query: { ...currentRoute.query, month: selectedMonth.value, year: selectedYear.value, withTrucks:truckOption.value },
              });
            }
            console.log(`Redirecting to: ${currentRoute.path} with Month: ${selectedMonth.value}, Year: ${selectedYear.value}`);
          } else {
            alert("Please select both a month and a year.");
          }
      }

    };

    // onMounted(() =>{
    //   alert('this is mounted')
    //   selectedMonth.value = ""
    //   selectedYear.value = ""
    // })



      //If Click I to other menu  selectedMonth and selectedYear will be empty
    watch(route, (newRoute, oldRoute)=> {
         urlPath.value = newRoute.fullPath
  
         
        if (Object.keys(newRoute.query).length == 0  ) {
          //  alert(JSON.stringify(newRoute.query))
            selectedMonth.value = ""
            selectedYear.value =  ""
            salesEmployementStatus.value = "Hired"
            if (currentUser.agent_type == 2){
                 dashboardOption.value = "team"
            }else{
                  dashboardOption.value = "individual"
            }
        
            leaderboardOption.value = "agent"
            
        }else{
          //  alert(JSON.stringify(newRoute.query))
            // selectedMonth.value = ""
            // selectedYear.value =  ""
            // salesEmployementStatus.value = "Hired"
        }
        console.log('navigation query is',newRoute.query)
      
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
