<template>
    <!-- <div class="p-4 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen  mt-20"> -->
    <div class="mt-20 p-4">
         <!-- Loading Spinner -->
    <div v-if="leaderBoardStore.state.loading">
      <spinner></spinner>
    </div>
      <h1 class="text-2xl font-extrabold text-gray-800 mb-3 text-center">Sales Agents Montly Performance  Information</h1>
     <div v-if="leaderBoardStore.state.leaderboard.length === 0"  class="text-red-700 font-bold  text-2xl">
       No Available Data.
     </div>
     
      <!-- Agents Table -->
      <div v-else class="overflow-x-auto shadow-xl rounded-lg">
     
        <table class="w-full table-auto border-collapse bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800">
              <th class="py-2 px-2  border text-center text-xs font-bold ">ID</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Name</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Employee Status</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Position</th>
               <th class="py-2 px-2  border text-center text-xs font-bold ">Manager</th>
               <th class="py-2 px-2  border text-center text-xs font-bold ">Market</th>
               <th class="py-2 px-2  border text-center text-xs font-bold ">Team</th>
              <th class="py-2 px-2 border text-center text-xs font-bold ">Month</th>
              <th class="py-2 px-2 border text-center text-xs font-bold ">Year</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Rating</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Rating Name</th>
              <th class="py-2 px-2  border text-center text-xs font-bold ">Image</th>
              <th class="py-2 px-2 border text-center text-xs font-bold ">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="agent in paginatedAgents"
              :key="agent.id"
              class="even:bg-blue-50 odd:bg-white"
            >
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.id }}
              </td>
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.db_name }}
              </td>
              <td class="py-1 px-2 border text-center text-xs text-gray-700"
              :class="agent.employee_status == 'Hired' || agent.employee_status=='Rehired' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'"
              >
                {{ agent.employee_status }}
              </td>     
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.agent_role }}
              </td>  
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.manager_dbname }}
              </td>               
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.market_name }}
              </td> 
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent?.team_name }}
              </td>                                                  
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.month }}
              </td>
              <td class="py-1 px-2 border text-center text-xs text-gray-700">
                {{ agent.year }}
              </td> 
              <td class="py-1 px-2 border text-center text-xs text-gray-700 font-bold" :class="setRatingColor(agent)">
                {{ agent.final_ratings }}
              </td>  
              <td class="py-1 px-2 border text-center text-xs text-gray-700 font-bold" :class="setRatingNameColor(agent)">
                {{ agent.ratings_name }}
              </td>                                       
              <td class="py-1 px-2 border text-center text-xs">
                <img
                  :src="updateImageLink(agent.image_link)"
                  alt="Agent Image"
                  class="h-10 w-12 rounded-full mx-auto border border-blue-200"
                />
              </td>
              <td class="py-0.5 px-2 border text-center text-xs">
                <div class="flex justify-center space-x-2" v-if="parseFloat(agent.final_ratings) > 0">
                  <NuxtLink 
                    :to="{
                      path: `/agent_performance/month`, query: { agent_type: agent.agent_type, agent_id: agent.id, month:agent.month, year:agent.year, withTrucks: true}
                      
                    }"
                    class="px-2 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Monthly Performance Details
                  </NuxtLink>


                </div>
                 <span v-else class="text-red-500 font-bold">NO  Monthly Performance Details</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-4 flex justify-center space-x-4">
        <button
          v-for="page in totalPages"
          :key="page"
          class="px-4 py-2 border rounded"
          :class="{
            'bg-blue-500 text-white': currentPage === page,
            'bg-white text-gray-700': currentPage !== page,
          }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  
  definePageMeta({
    middleware: ['auth', 'adminmanager']
  })
  
  import { ref, computed } from 'vue';
  import { onMounted } from 'vue';
import { parse } from 'vue/compiler-sfc';
  
  //get the current user
  const authStore = useAuthStore()
  authStore.fetchTokenFromLocalStore()
  
  const currentUser = authStore.state.user 

  const router = useRouter()
  const route = useRoute()
  const query = route.query

  const year_summary = false
  const leaderboardOption = 'all'
  
  
  const leaderBoardStore = useLeaderBoardStore()
  

  // Method to fetch leaderboard data
const leaderBoardData = (leaderboardOption, query, year_summary) => {
  leaderBoardStore.fetchLeaderboard(leaderboardOption, query, year_summary);
};

  const itemsPerPage = 10;
  const currentPage = ref(1);

  
//   const agents = computed(() => manageSalesAgentStore.state.salesAgents);

  const agents = computed(() => leaderBoardStore.state.leaderboard);
 
  const totalPages = computed(() =>
    Math.ceil(agents.value.length / itemsPerPage)
  )
  
  const paginatedAgents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return agents.value.slice(start, end);
  });

  //get image url from the .env file
  const config = useRuntimeConfig()

  const updateImageLink = (imageLink) => {
        return `${config.public.imageBaseUrl}${imageLink}`
  }



  const setRatingNameColor = (agent) => {
  if (agent.ratings_name == 'EXCEPTIONAL') {
    return 'text-purple-600'
  }
  
  if (agent.ratings_name == 'VERY SATISFACTORY') {
    return 'text-blue-500'
  }

  if (agent.ratings_name == 'SATISFACTORY') {
    return 'text-green-600'
  }
  if (agent.ratings_name == 'NEEDS IMPROVEMENT') {
    return 'text-yellow-600'
  }

  if (agent.ratings_name == 'POOR') {
    return 'text-red-600'
  }

    if (agent.ratings_name == 'INCOMPLETE RATING') {
    return 'text-orange-300'
  }
}

const setRatingColor = (agent) => {
  if (agent.final_ratings >= 5 ) {
    return 'text-purple-600'
  }
  
  if (agent.final_ratings >= 4 && agent.final_ratings < 5) {
    return 'text-blue-500'
  }

  if (agent.final_ratings >= 3 && agent.final_ratings < 4) {
    return 'text-green-600'
  }
  if (agent.final_ratings >= 2 && agent.final_ratings < 3) {
    return 'text-yellow-600'
  }

  if (agent.final_ratings <= 1 && agent.final_ratings < 2) {
    return 'text-red-600'
  }
}
  

  onMounted(() => {

    leaderBoardData(leaderboardOption,route.query, year_summary)

  });


  watch(route, (newRoute) => {
  console.log('The route is change. we should react to the change..')
  router.push(newRoute.fullPath)
  leaderBoardData(leaderboardOption, newRoute.query, year_summary)
  
})
  
  
  </script>
  