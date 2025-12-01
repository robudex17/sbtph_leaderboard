<template>
    <div>
        <header class="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 fixed">
          <!-- Brand -->
          <div class="flex items-center gap-10">
              <div class="text-lg font-bold">SBTPH SALES APP</div>
              <div
                v-if="hasCustomSearchOption"
                class="flex flex-col sm:flex-row items-center gap-4"
              >
                <!-- Filter By Dropdown -->
                <div class="flex items-center gap-2" v-if="data?.length > 0">
                
                  <label for="filter-by" class="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Filter By:
                  </label>
                  <select
                    id="filter-by"
                    v-model="selectedFilter"
                    @change="fetchFilterValues"
                    class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option v-for="item in filterBy" :key="item" :value="item">
                      {{ item.toUpperCase() }}
                    </option>
                  </select>
                </div>

                <!-- Filter Value Dropdown -->
                <div class="flex items-center gap-2"  v-if="data?.length > 0" >
                  <label for="filter-value" class="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Value:
                  </label>
                  <select
                    id="filter-value"
                    v-model="selectedFilterValue"
                    class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="all">All</option>
                    <option v-for="option in filterValueList" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </option>
                  </select>
                </div>

                <!-- Start Date -->
                <div class="flex items-center gap-2">
                  <label for="start-date" class="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Start Date:
                  </label>
                  <input
                    id="start-date"
                    type="month"
                    v-model="selectStartDate"
                    class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <!-- End Date -->
                <div class="flex items-center gap-2">
                  <label for="end-date" class="text-sm font-medium text-gray-700 whitespace-nowrap">
                    End Date:
                  </label>
                  <input
                    id="end-date"
                    type="month"
                    v-model="selectEndDate"
                    class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <!-- Submit Button -->
                <button
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click="submitCustomSearchSelection"
                >
                  Submit
                </button>

                <button 
                  class="px-4 py-2 ml-0 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click="reset"
                >
                  Reset
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

    
        </header>
    </div>
</template>

<script setup>
    import { ref, watch,computed } from "vue";
    import API from "~/utils/api"


    //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()

    const currentUser = authStore.state.user 


    const config = useRuntimeConfig()

    const updateImageLink = (imageLink) => {
        return `${config.public.imageBaseUrl}${imageLink}`
      }


    const router = useRouter()
    const route = useRoute()
   
    const selectStartDate = ref("")
    const selectEndDate = ref("")
    const filterBy = ref([
      'lms','agent', 'all','market', 'team'
    ])

    const selectedFilter = ref('all') // Default selected
    const selectedFilterValue = ref('all') // Default "All"
    // const filterValueList = ref([]) // Data fetched from API

        // Stores
    const customSeachStore = useCustomSearchStore() 
    const data = computed(() => customSeachStore.state.customSearch)

    const filterValueList = computed(() => {
      if (!data.value || !Array.isArray(data.value)) return []

      let filtered = []
     if(selectedFilter.value == 'all'){
       filtered = data.value.map(agent => ({
            id: agent.id,
            name: agent.db_name
          }))
     
     }
     else if (selectedFilter.value === 'lms') {
        filtered = data.value
          .filter(agent => agent.agent_type == 1)
          .map(agent => ({
            id: agent.id,
            name: agent.db_name
          }))
      } 
      else if (selectedFilter.value === 'agent') {
        filtered = data.value
          .filter(agent => agent.agent_type == 0)
          .map(agent => ({
            id: agent.id,
            name: agent.db_name
          }))
      } 
      else if (selectedFilter.value === 'team') {
        filtered = data.value.map(agent => ({
          id: agent.team_id,
          name: agent.team_name
        }))
      } 
      else if (selectedFilter.value === 'market') {
        filtered = data.value.map(agent => ({
          id: agent.market_id,  // fixed typo: should use market_id
          name: agent.market_name
        }))
      } 
      else {
        return []
      }

      // ✅ remove duplicates
      const unique = Array.from(
        new Map(
          filtered.map(obj => [JSON.stringify(obj), obj])
        ).values()
      )

      return unique
    })

    customSeachStore.state.isResetting = false

   const reset = async() => {

      customSeachStore.state.isResetting = true
      const currentRoute = router.currentRoute.value;
      customSeachStore.state.customSearch = []
      selectedFilter.value  =  'all' // = ref('all') // Default selected
      selectedFilterValue.value =  'all'  //ref('all') // Default "All"
      selectStartDate.value = ""
      selectEndDate.value = ""

      await router.replace({
        path: router.currentRoute.value.path,
        query: {}
      })

  
   }

   
    const searchType = route.params.search_type
    //Dynamic API URL 


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
        '/admin/target/monthly',
         '/admin/target/yearly',
        '/admin/target/custom_search/target'



    ])

    const pathWithCustomSearchOption = ref([
       '/admin/target/custom_search/target',
    ])



    const hasCustomSearchOption = computed( () => pathWithCustomSearchOption.value.includes(route.path) )

    
   const submitCustomSearchSelection = () => {
     
      const currentRoute = router.currentRoute.value;   
       router.push({
              path: currentRoute.path,
              query: { ...currentRoute.query,start_date:selectStartDate.value,end_date:selectEndDate.value, filterBy: selectedFilter.value, filterId:selectedFilterValue.value  },})

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
  header {
    z-index: 10;
  }
</style>
