<template>
  <div class="grid grid-cols-1 gap-4 p-4 mt-20">
    <div v-if="dashBoardStore.state.loading">
        <spinner></spinner>
    </div>
    <div v-else>
        <div v-if="dashboardoption =='individual'">
                <p class="text-gray-800 font-bold text-7xl mb-10">Per Agent Performance</p>
                <p  class="text-gray-800 font-bold text-4xl mb-3">Target Vs ShipOk  as of: <span class="text-red-600">( {{ month }} {{ year }})</span></p>
                <div v-for="target_shipok in data" :key="target_shipok.market_id" class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">{{ target_shipok.db_name }} - {{ target_shipok.market_name }}</h2>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="bg-blue-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ target_shipok.total_target }}</p>
                        <p class="text-gray-600 font-medium text-lg">Target(units)</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ target_shipok.total_ship_ok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Ship OK(units)</p>
                        </div>
                        <div class="bg-yellow-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">
                            {{ target_shipok.total_target > 0 ? ((target_shipok.total_ship_ok / target_shipok.total_target) * 100).toFixed(2) + '%' : '0%' }}
                        </p>
                        <p class="text-gray-600 font-medium text-lg">Percentage</p>
                        </div>
                        <div :class="(target_shipok.total_target - target_shipok.total_ship_ok) >= 0 ? 'bg-red-100' : 'bg-green-100'" class="p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">{{ target_shipok.total_target - target_shipok.total_ship_ok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Remaining(units)</p>
                        </div>
                    </div>
                </div>                
        </div>
          <div v-else-if="dashboardoption =='team'">
                <p class="text-gray-800 font-bold text-7xl mb-10">Per Market Performance</p>
                <p  class="text-gray-800 font-bold text-4xl mb-3">Target Vs ShipOk  as of: <span class="text-red-600">( {{ month }} {{ year }})</span></p>
                
                <div v-for="target_shipok in data" :key="target_shipok.market_id" class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">{{ target_shipok.market_name }}</h2>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="bg-blue-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ target_shipok.total_target }}</p>
                        <p class="text-gray-600 font-medium text-lg">Target(units)</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ target_shipok.total_ship_ok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Ship OK(units)</p>
                        </div>
                        <div class="bg-yellow-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">
                            {{ target_shipok.total_target > 0 ? ((target_shipok.total_ship_ok / target_shipok.total_target) * 100).toFixed(2) + '%' : '0%' }}
                        </p>
                        <p class="text-gray-600 font-medium text-lg">Percentage</p>
                        </div>
                        <div :class="(target_shipok.total_target - target_shipok.total_ship_ok) >= 0 ? 'bg-red-100' : 'bg-green-100'" class="p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">{{ target_shipok.total_target - target_shipok.total_ship_ok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Remaining(units)</p>
                        </div>
                    </div>
                    <button
                    @click="toggleTable(target_shipok.market_id)"
                      :class="[
                            'mb-1 mt-2 px-2 py-1 text-white rounded text-xs font-bold transition-colors duration-200',
                            activeMarketId === target_shipok.market_id ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
                        ]"
                    >
                    {{ activeMarketId === target_shipok.market_id ? 'Hide Breakdown' : 'Show Breakdown' }}
                    </button>

                    <div v-if="activeMarketId === target_shipok.market_id" class="overflow-x-auto">
                    <h1 class="text-2xl font-bold mt-2 mb-3 text-center">AGENTS CONTRIBUTIONS</h1>
                    <table class="min-w-full border border-green-500 rounded-lg">
                        <thead class="bg-green-300">
                        <tr>
                            <th class="py-2 px-4 text-left text-sm font-bold text-green-900">AGENT</th>
                            <th class="py-2 px-4 text-left text-sm font-bold text-green-900">TARGET CONTRIBUTION</th>
                            <th class="py-2 px-4 text-left text-sm font-bold text-green-900">TARGET CONTRIBUTION PERCENTAGE (%)</th>
                            <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHIPOK CONTRIBUTION</th>
                            <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHIPOK CONTRIBUTION PERCENTAGE (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(agent, index) in target_shipok.teammembers"
                            :key="`${target_shipok.market_id}-${agent.db_name}`"
                            :class="rowClass(agent, index)"
                        >
                            <td class="py-2 px-4 text-md uppercase">{{ agent.db_name }}</td>
                            <td class="py-2 px-4 text-md uppercase">{{ agent.total_target }}</td>
                            <td class="py-2 px-4 text-md">
                            {{ agent.total_target > 0 ? ((agent.total_target / target_shipok.total_target) * 100).toFixed(2) + '%' : '0%' }}
                            </td>
                            <td class="py-2 px-4 text-md">{{ agent.total_ship_ok }}</td>
                            <td class="py-2 px-4 text-md">
                            {{ agent.total_ship_ok > 0 ? ((agent.total_ship_ok / target_shipok.total_ship_ok) * 100).toFixed(2) + '%' : '0%' }}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>

                </div>

            </div>
            <!-- <p class="text-gray-800 font-bold text-4xl mt-5 mb-5 pt-10">New Deposit <span class="text-red-600">({{ trucks }})</span> as of: <span class="text-red-600">( {{ month }} {{ year }})</span></p>
            <div v-for="target_shipok in data" :key="target_shipok.market_id" class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">{{ target_shipok.market_name }}</h2>
                <div class="grid grid-cols-1 gap-4">
                    <div class="bg-orange-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                    <p class="text-gray-800 font-bold text-7xl">{{ target_shipok.total_deposit }}</p>
                    <p class="text-gray-600 font-medium text-lg">New Deposit(account)</p>
                    </div>
          
            
                </div>
            </div>     -->
            <div v-else-if="dashboardoption=='overall'">
                <p class="text-gray-800 font-bold text-7xl mb-10 ">Overall Market Performance</p>
                <p  class="text-gray-800 font-bold text-4xl mb-3">Target Vs ShipOk  as of: <span class="text-red-600">( {{ month }} {{ year }})</span></p>
                <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">All Market</h2>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="bg-blue-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ data.monthly_target }}</p>
                        <p class="text-gray-600 font-medium text-lg">Target(units)</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-7xl">{{ data.total_shipok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Ship OK(units)</p>
                        </div>
                        <div class="bg-yellow-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">
                            {{ data.monthly_target > 0 ? ((data.total_shipok / data.monthly_target) * 100).toFixed(2) + '%' : '0%' }}
                        </p>
                        <p class="text-gray-600 font-medium text-lg">Percentage</p>
                        </div>
                        <div :class="(data.monthly_target - data.total_shipok) >= 0 ? 'bg-red-100' : 'bg-green-100'" class="p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                        <p class="text-gray-800 font-bold text-6xl">{{ data.monthly_target - data.total_shipok }}</p>
                        <p class="text-gray-600 font-medium text-lg">Remaining(units)</p>
                        </div>
                    </div>
                </div>
                <button
                @click="toggleOverallTable"
                :class="[
                'mb-1 mt-2 px-2 py-1 text-white rounded text-xs font-bold transition-colors duration-200',
                activeOverallBreakdown ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
                ]"
                >
                {{ activeOverallBreakdown ? 'Hide Breakdown' : 'Show Breakdown' }}
                </button>

                <transition name="fade">
                <div v-if="activeOverallBreakdown" class="overflow-x-auto">
                    <h1 class="text-2xl font-bold mt-1 mb- text-center">MARKET TEAM CONTRIBUTIONS</h1>
                    <table class="min-w-full border border-green-500 rounded-lg mb-3">
                    <thead class="bg-green-300">
                        <tr>
                        <th class="py-2 px-4 text-left text-sm font-bold text-green-900">MARKET</th>
                        <th class="py-2 px-4 text-left text-sm font-bold text-green-900">TARGET CONTRIBUTION</th>
                        <th class="py-2 px-4 text-left text-sm font-bold text-green-900">TARGET CONTRIBUTION PERCENTAGE (%)</th>
                        <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHIPOK CONTRIBUTION</th>
                        <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHIPOK CONTRIBUTION PERCENTAGE (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(market, index) in data.team"
                        :key="`market-${market.market_id}`"
                        :class="rowClass(market, index)"
                        >
                        <td class="py-2 px-4 text-md uppercase">{{ market.market_name }}</td>
                        <td class="py-2 px-4 text-md uppercase">{{ market.total_target }}</td>
                        <td class="py-2 px-4 text-md">
                            {{ market.total_target > 0 ? ((market.total_target / data.monthly_target) * 100).toFixed(2) + '%' : '0%' }}
                        </td>
                        <td class="py-2 px-4 text-md">{{ market.total_ship_ok }}</td>
                        <td class="py-2 px-4 text-md">
                            {{ market.total_ship_ok > 0 ? ((market.total_ship_ok / data.total_shipok) * 100).toFixed(2) + '%' : '0%' }}
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </transition>
           
            </div>
            <!-- <p class="text-gray-800 font-bold text-4xl mt-5 mb-5 pt-10">New Deposit <span class="text-red-600">({{ trucks }})</span> as of: <span class="text-red-600">( {{ month }} {{ year }})</span></p>
            <div  class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">All Market</h2>
                <div class="grid grid-cols-1 gap-4">
                    <div class="bg-orange-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
                    <p class="text-gray-800 font-bold text-7xl">{{ dataOverallDeposit.new_deposit }}</p>
                    <p class="text-gray-600 font-medium text-lg">New Deposit(account)</p>
                    </div>
          
            
                </div>
            </div>               -->
   </div>

    
  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
authStore.fetchTokenFromLocalStore()

const router = useRouter()
const route = useRoute()

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const month = ref(months[new Date().getMonth()])
const year = ref(new Date().getFullYear())

const dashboardoption = ref(route.query.dashboardoption || 'individual')

// Stores
const dashBoardStore = useDashBoardStore()
const data = computed(() => dashBoardStore.state.dashboard.data)

// Only one open at a time
const activeMarketId = ref(null)         // for team view
const activeOverallBreakdown = ref(false) // for 'overall' view only

const fetchDashboardData = async () => {
  activeMarketId.value = null
  activeOverallBreakdown.value = false
  await dashBoardStore.fetchDashboard(route.query)
}

onMounted(fetchDashboardData)

watch(() => route.query.dashboardoption, async (newOption) => {
  dashboardoption.value = newOption
  activeMarketId.value = null
  activeOverallBreakdown.value = false
  await fetchDashboardData()
})

// Toggle logic
const toggleTable = (id) => {
  activeMarketId.value = (activeMarketId.value === id) ? null : id
}

const toggleOverallTable = () => {
  activeOverallBreakdown.value = !activeOverallBreakdown.value
}

const rowClass = computed(() => {
  return (item, index) => {
    return index % 2 === 0
      ? "bg-white text-green-800 font-bold"
      : "bg-green-100 text-green-800 font-bold"
  }
})
</script>


 <!-- <script setup>

definePageMeta({
   middleware: 'auth'
})
import { onMounted,computed } from 'vue';

import Chart from 'chart.js/auto';
import { text } from '@fortawesome/fontawesome-svg-core';

//get the current user
const authStore = useAuthStore()
authStore.fetchTokenFromLocalStore()

const currentUser = authStore.state.user 


const router = useRouter()
const route = useRoute()



const query = route.query

const month = ref(null)
const year = ref(null)

const dashboardoption = ref("individual")
    // Months for the dropdown
    const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
         ];


month.value= months[new Date().getMonth()]
year.value = new Date().getFullYear() 

if(!query.dashboardoption){
  query.dashboardoption =  'individual'
}



const dashBoardStore = useDashBoardStore()

const data = computed(() => {
   return dashBoardStore.state.dashboard.data
})


// Reactive object to track which tables are shown
const showTable = reactive({})

const showMarketTable = ref(false)


const toggleTable = (id) => {
  showTable[id] = !showTable[id]
}


onMounted(async () => {
  
  //Initialize all show breakdown button to false
//    data.forEach(d => {
//      showTable[d.market_id] =!showTable[id]
//    })
    await dashBoardStore.fetchDashboard(query)
  
 
})

onMounted(async () => {
  Object.keys(showTable).forEach(key => delete showTable[key])
  await dashBoardStore.fetchDashboard(query)
})

watch(route,  async (newRoute) => {
  console.log('The route is change. we should react to the change..')

  
  dashboardoption.value = newRoute.query.dashboardoption

  console.log(newRoute.query)
  router.push(newRoute.fullPath)
  await dashBoardStore.fetchDashboard(newRoute.query)

  
})

const rowClass = computed(() => {
    return (agent, index) => {

        return index % 2 === 0 ? "bg-white  text-green-800 font-bold" : "font-bold bg-green-100 text-green-800"; // Alternate row colors
    };
   });

</script>  -->



<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
