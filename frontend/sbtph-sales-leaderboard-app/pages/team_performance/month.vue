<template>
    <div class="p-4 mt-20">
     <!-- Loading Spinner -->
     <div v-if="marketStore.state.loading">
      <spinner></spinner>
    </div>
     <div v-else>
        <div v-if="marketStore.state.market_target_shipok.length === 0" class="text-red-700 font-bold  text-2xl">
         <h1 class="text-2xl font-bold mb-4 text-center text-black">Market Target/ShipOk</h1>
          No Available Data.
       </div>
       <div v-else>
            <div class="mb-4 flex justify-end">
            <export-to-excel-component  v-if="isAdmin" class="ml-2"
                :exportUrl="exportUrl"
                :exportFileName="exportFileName"
                :query="query"
                :token="token"
            ></export-to-excel-component>          
            </div>
                <h1 class="text-2xl font-bold mb-4 text-center">Market Target/ShipOk</h1>
                <div class="overflow-x-auto">
                <table class="min-w-full border border-green-500 rounded-lg">
                <thead class="bg-green-300">
                    <tr>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900 ">MARKET</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">MONTH</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">YEAR</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">TARGET</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHIPOK</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">SHORTAGE</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">ACHIEVEMENT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                    v-for="(mts, index) in marketStore.state.market_target_shipok" 
                    :key="mts.id + index" 
                    :class="rowClass(mts, index)">
                    <td class="py-2 px-4 text-sm  uppercase">{{ mts.market_name }}</td>
                    <td class="py-2 px-4 text-sm uppercase">{{ mts.month }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mts.year }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mts.total_target }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mts.total_ship_ok }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mts.shortage }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mts.achievement }}%</td> 
                    
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
        <div v-if ="marketStore.state.market_target_shipok.length === 0" class="text-red-700 font-bold  text-2xl">
            <h1 class="text-2xl font-bold mb-4 text-center text-black pt-10">Market New Deposit</h1>
            No Available Data.
        </div>
        <div v-else>
            <h1 class="text-2xl font-bold mb-4 text-center pt-10">Market New Deposit</h1>
                <div class="overflow-x-auto">
                <table class="min-w-full border border-green-500 rounded-lg">
                <thead class="bg-green-300">
                    <tr>
                    <th class="py-2 px-4 text-left text-sm font-medium text-green-900">MARKET</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">MONTH</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">YEAR</th>
                    <th class="py-2 px-4 text-left text-sm font-bold text-green-900">NEW DEPOSIT</th>
                    
                 
                    
                
                    </tr>
                </thead>
                <tbody>
                    <tr 
                    v-for="(mnd, index) in marketStore.state.market_new_deposit" 
                    :key="mnd.market_id + index" 
                    :class="rowClass(mnd, index)"
                    >
                    <td class="py-2 px-4 text-sm uppercase">{{ mnd.market_name }}</td>
                    <td class="py-2 px-4 text-sm  uppercase" >{{ mnd.month }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mnd.year }}</td>
                    <td class="py-2 px-4 text-sm ">{{ mnd.new_deposit }}</td>
                
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
     </div>
  
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, watch } from 'vue';
    
    import API from '~/utils/api'

   
    definePageMeta({
      middleware: ['auth'] 
    })
  

    //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()
    const currentUser = authStore.state.user 
    const token = authStore.state.token
    const isAdmin = ref(false)
    const month = ref(null)
    const year = ref(null)

    const query = ref({})
   
    const marketStore  = useMarketStore()

   
    const route = useRoute()
    const router = useRouter()

    query.value = route.query
   
    const  errorTarget = ref("")
     const errorShipOk = ref("")

     const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
         ];


    month.value= query.value.month
    year.value = query.value.year 

    if (month.value == null || month.value == ""){
        month.value= months[new Date().getMonth()]
     }

    if (year.value == null || year.value == ""){
        year.value = new Date().getFullYear()
    }
   


    if (currentUser.login_type == 'standarduser' && currentUser.role == 'admin'){
         isAdmin.value = true
        
    }

    const exportUrl = API.export.team_performance_monthly

    const exportFileName = computed(()=> {
    return `monthly(${month.value}-${year.value})-teamperformance.xlsx`
    })


    const rowClass = computed(() => {
    return (mnd, index) => {
        if (currentUser.market_id === mnd.market_id) {
            return "bg-black text-green-300 font-bold"; // Highlighted row
        }
        return index % 2 === 0 ? "bg-white  text-green-800" : "bg-green-50 text-green-800"; // Alternate row colors
    };
   });



   onMounted(async() => {
    marketStore.state.market_target_shipok = []; // Clear previous data
    marketStore.state.market_new_deposit = [];  // Clear previous data

   await marketStore.fetchAgentMarketTargetShipok(query.value);
   await marketStore.fetchAgentMarketNewDeposit(query.value);
});


// watch(
//   () => route.query,
//    (newQuery, oldQuery) => {
//     // Only run if there's a real change
//     if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
//       marketStore.state.market_target_shipok = [];
//       marketStore.state.market_new_deposit = [];
//       marketStore.fetchAgentMarketTargetShipok(newQuery);
//       marketStore.fetchAgentMarketNewDeposit(newQuery);
//       query.value = newQuery;
//       month.value = query.value.month;
//       year.value = query.value.year;
//     }
//   },
//   { deep: true }
// );

watch(() => route.query, async (newQuery, oldQuery) => {
    console.log("Route query changed, fetching new data...");

    // Prevent unnecessary fetch if query hasn't changed
    if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) return;

    // Clear previous data before fetching new data
    marketStore.state.market_target_shipok = [];
    marketStore.state.market_new_deposit = [];

    query.value = newQuery
    month.value = newQuery.month 
    year.value = newQuery.year
    await marketStore.fetchAgentMarketTargetShipok(query.value);
    await marketStore.fetchAgentMarketNewDeposit(query.value);
    
}, { deep: true }); // Ensures deep watching of query object

  </script>
  
  <style>
  /* Add custom styles if needed */
  </style>
  