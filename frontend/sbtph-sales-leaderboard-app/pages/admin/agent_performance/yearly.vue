<template>
  <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen  mt-20">
       <!-- Loading Spinner -->
  <div v-if="leaderBoardStore.state.loading">
    <spinner></spinner>
  </div>

    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">Sales Agents Yearly Performance  Information</h1>
   <div v-if="leaderBoardStore.state.leaderboard.length === 0"  class="text-red-700 font-bold  text-5xl">
     No Available Data.
   </div>
   
    <!-- Agents Table -->
    <div v-else class="overflow-x-auto shadow-xl rounded-lg">
      <table class="w-full table-auto border-collapse bg-white">
        <thead>
          <tr class="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800">
            <th class="py-4 px-6 border font-semibold uppercase">ID</th>
            <th class="py-4 px-6 border font-semibold uppercase">Database Name</th>
            <th class="py-4 px-6 border font-semibold uppercase">Agent</th>
            <th class="py-4 px-6 border font-semibold uppercase">Year</th>
            <th class="py-4 px-6 border font-semibold uppercase">Rating</th>
            <th class="py-4 px-6 border font-semibold uppercase">Rating Name</th>
            <th class="py-4 px-6 border font-semibold uppercase">Image</th>
            <th class="py-4 px-6 border font-semibold uppercase">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="agent in paginatedAgents"
            :key="agent.id"
            class="even:bg-blue-50 odd:bg-white"
          >
            <td class="py-4 px-6 border text-center text-gray-700">
              {{ agent.id }}
            </td>
            <td class="py-4 px-6 border text-center text-gray-700">
              {{ agent.db_name }}
            </td>

            <td class="py-4 px-6 border text-center text-gray-700">
              {{ agent.year }}
            </td> 
            <td class="py-4 px-6 border text-center text-gray-700 font-bold" :class="setRatingColor(agent)">
              {{ agent.final_ratings }}
            </td>  
            <td class="py-4 px-6 border text-center text-gray-700 font-bold" :class="setRatingNameColor(agent)">
              {{ agent.ratings_name }}
            </td>                                       
            <td class="py-4 px-6 border text-center">
              <img
                :src="agent.image_link"
                alt="Agent Image"
                class="h-12 w-12 rounded-full mx-auto border border-blue-200"
              />
            </td>
            <td class="py-4 px-6 border text-center">
              <div v-if="agent.ratings_name =='No Ratings' " class="flex justify-center space-x-2" >NO Details</div>
              <div v-else class="flex justify-center space-x-2" >
                <NuxtLink 
                  :to="{
                    path: `/agent_performance/year?`, query: { agent_type: agent.agent_type, fullyear: true , agent_id: agent.id, year:agent.year, withTrucks: true}
                    
                  }"
                  class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Yearly Performance Details
                </NuxtLink>


              </div>
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

//get the current user
const authStore = useAuthStore()
authStore.fetchTokenFromLocalStore()

const currentUser = authStore.state.user 

const router = useRouter()
const route = useRoute()
const query = route.query

// query.year_summary = true

const agentYear = ref([])




const leaderBoardStore = useLeaderBoardStore()


query.year_summary = true


  // const agent = computed(() => {
  //   return leaderBoardStore.state.agentYearPerformance.yearAverage
  // })



console.log('agent year', agentYear.value)

// Method to fetch leaderboard data
const leaderBoardData = async (query) => {
leaderBoardStore.fetchLeaderboard(query);
};

const itemsPerPage = 10;
const currentPage = ref(1);


const agents = computed(() => leaderBoardStore.state.leaderboard);

const totalPages = computed(() =>
  Math.ceil(agents.value.length / itemsPerPage)
)

const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return agents.value.slice(start, end);
});


const setRatingNameColor = (agent) => {
if (agent.ratings_name == 'EXCEPTIONAL') {
  return 'text-purple-600'
}

if (agent.ratings_name == 'VERY SATISFACTORY') {
  return 'text-blue-800'
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
}

const setRatingColor = (agent) => {
if (agent.final_ratings >= 5 ) {
  return 'text-purple-600'
}

if (agent.final_ratings >= 4 && agent.final_ratings < 5) {
  return 'text-blue-800'
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


 // Fetch leaderboard data on mount
 onMounted( async() => {
    await leaderBoardData(query);
    
  })

watch(route, (newRoute) => {
console.log('The route is change. we should react to the change..')
router.push(newRoute.fullPath)
leaderBoardData(newRoute.query)

})


</script>
