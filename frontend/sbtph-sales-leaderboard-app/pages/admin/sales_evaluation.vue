<template>
  <div class=" bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-4 mt-20">
    <!-- Loading Spinner -->
    <!-- <div v-if="useFeedbackStore.state.loading">
      <spinner></spinner>
    </div> -->
    <div >

        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">SALES AGENTS EVALUATION</h1>
        <!-- Agents Table -->
        <div class="overflow-x-auto shadow-xl rounded-lg">
          <table class="w-full table-auto border-collapse bg-white">
            <!-- Table Head -->
                <thead>
                <tr class="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800">
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">ID</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Name</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Market</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Month</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Year</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Target</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">ShipOk</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">New Deposit</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Absences</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Tardiness</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Memo</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Feedback (Admin)</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Feedback (QA)</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Feedback (AGENTS)</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Feedback (LM)</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Feedback (UM)</th>
                    <th class="py-0.5 px-4 text-center text-xs font-bold text-green-900">Actions</th>
                </tr>
                </thead>
            <!-- Table Body -->
                <tbody>
                <tr
                    v-for="(agent, index) in paginatedAgents"
                    :key="index"
                    class="even:bg-blue-50 odd:bg-white hover:bg-blue-100 transition-colors"
                >
                    <!-- ID -->
                    <td class="py-0.5 px-4 text-center text-xs text-gray-700 border">
                    {{ agent.id }}
                    </td>

                     <!-- Name with Avatar -->
                    <td class="py-0.5 pr-12 text-left text-xs font-medium text-green-900 border">
                        <div class="flex items-center space-x-2">
                            <img
                            v-if="agent && agent.image_link"
                            :src="updateImageLink(agent.image_link)"
                            alt="Agent Image"
                            class="w-9 h-9 rounded-full object-cover shadow"
                            />
                            <span >{{ agent.db_name }}</span>
                        </div>
                    </td>
                    
                    <!-- Market, Month, Year, Target, ShipOk -->
                    <td class="py-0.5 px-4 text-left text-xs font-medium text-gray-700 border">
                     {{ agent.market_name }}
                    </td>
                    <td class="py-0.5 px-4 text-left text-xs font-medium text-gray-700 border">
                    {{ agent.month }}
                    </td>
                    <td class="py-0.5 px-4 text-left text-xs font-medium text-gray-700 border">
                    {{ agent.year }}
                    </td>
                    <td class="py-0.5 px-4 text-left text-xs font-medium text-gray-700 border">
                    {{ agent.target }}
                    </td>
                    <td class="py-0.5 px-4 text-left text-xs font-medium text-gray-700 border">
                    {{ agent.ship_ok }}
                    </td>

                    <!-- Performance Metrics -->
                    <td class="py-0.5 px-4 text-center text-xs font-medium text-gray-700 border">
                    {{ agent.total_new_deposit }}
                    </td>
                    <td class="py-0.5 px-4 text-center text-xs font-medium text-gray-700 border">
                    {{ agent.total_absences }}
                    </td>
                    <td class="py-0.5 px-4 text-center text-xs font-medium text-gray-700 border">
                    {{ agent.total_tardiness }}
                    </td>
                    <td class="py-0.5 px-4 text-center text-xs font-medium text-gray-700 border">
                    {{ agent.total_memo }}
                    </td>

                    <!-- Feedback Columns -->
                    <td
                    class="py-0.5 px-4 text-center text-xs border"
                    :class="{ 'text-red-500 font-bold': agent.feedback_admin === 'No Feedback', 'text-green-900 font-medium': agent.feedback_admin !== 'No Feedback' }"
                    >
                    {{ agent.feedback_admin }}
                    </td>
                    <td
                    class="py-0.5 px-4 text-center text-xs border"
                    :class="{ 'text-red-500 font-bold': agent.feedback_qa === 'No Feedback', 'text-green-900 font-medium': agent.feedback_qa !== 'No Feedback' }"
                    >
                    {{ agent.feedback_qa }}
                    </td>
                     <td
                    class="py-0.5 px-4 text-center text-xs border font-medium text-blue-700"
                    
                    >
                    
                    <button v-if="agent.ave_feedback_by_agents != null"  @click="openModal( agent.feedback_by_agents)" >
                        {{ agent.ave_feedback_by_agents }}
                    </button>
                    </td>
                    <td
                    class="py-0.5 px-4 text-center text-xs border font-medium text-blue-700"
                  
                    >
                    

                    <button v-if="agent.ave_feedback_by_lm != null"  @click="openModal( agent.feedback_by_lm )" >
                       {{ agent.ave_feedback_by_lm }}
                    </button>
                    </td>
                    <td
                    class="py-0.5 px-4 text-center text-xs border font-medium text-blue-700"
                   
                    >

                    <button v-if="agent.ave_feedback_by_um != null"  @click="openModal( agent.feedback_by_um )" >
                        {{ agent.ave_feedback_by_um }}
                    </button>                    
                    </td>
                   
                    <!-- Actions -->
                    <td class="py-0.5 px-4 text-center border">
                    <div class="flex justify-center space-x-2">

                        <!-- Submit / Submitted Button -->
                        <button
                          @click="submitSalesEvaluation(agent)"
                        :disabled="!agent.ready_to_submit || agent.submitted == 1"
                        :class="[
                            'py-0.5 px-3 rounded-lg flex items-center gap-2 text-sm',
                            agent.submitted == 1
                            ? 'bg-gray-400 text-white cursor-not-allowed' // Already submitted
                            : agent.ready_to_submit
                                ? 'bg-green-500 text-white hover:bg-green-600' // Ready to submit
                                : 'bg-gray-400 text-white cursor-not-allowed'   // Not ready
                        ]"
                        >
                        {{ agent.submitted == 1 ? 'Submitted' : 'Submit' }}
                        </button>

                        <!-- Review Button -->
                        <button
                        v-if="agent.submitted == 1"
                        @click="reviewSalesEvaluation(agent)"
                        class="bg-purple-500 text-white py-0.5 px-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                        Review
                        </button>

                    </div>
                    </td>


                </tr>
                </tbody>     
          </table>

      <!-- Modal -->
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-3/4 overflow-hidden">
          
          <!-- Header -->
          <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h2 class="text-lg font-bold">
              {{ modalType === 'qa' ? 'QA Feedback Details' : 'Update/Delete Feedback' }}
            </h2>
            <button 
              @click="closeModal" 
              class="text-white hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="bg-gray-50 p-6 max-h-[70vh] overflow-y-auto overflow-x-hidden">
            <table class="min-w-full table-fixed border-collapse">
              <thead>
                <tr class="bg-gray-200 text-gray-700" v-if="modalData.length > 0">
                  <th class="w-1/4 px-4 py-2 text-left font-semibold">Feedback By</th>
                  <th class="w-1/6 px-4 py-2 text-left font-semibold">Month</th>
                  <th class="w-1/6 px-4 py-2 text-left font-semibold">Year</th>
                  <th class="w-1/6 px-4 py-2 text-left font-semibold">Feedback Score</th>
                </tr>
             
              </thead>
              <tbody v-if="modalData.length > 0">
                <tr 
                  v-for="data in modalData" 
                  :key="data.who_give_feedback_id" 
                  class="border-b hover:bg-gray-100 transition"
                >
                  <!-- Feedback By -->
                  <td class="px-4 py-3 flex items-center space-x-3">
                    <img
                      v-if="data && data.image_link"
                      :src="updateImageLink(data.image_link)"
                      alt="Agent Image"
                      class="w-10 h-10 rounded-full object-cover border"
                    />
                    <span class="font-medium text-gray-800">
                      {{ data.who_give_feedback_name }}
                    </span>
                  </td>

                  <!-- Month -->
                  <td class="px-4 py-3 font-semibold">{{ data.month }}</td>

                  <!-- Year -->
                  <td class="px-4 py-3 font-semibold">{{ data.year }}</td>

                  <!-- Score -->
                <td class="border px-4 py-2 text-center">
                  <span
                    v-if="parseFloat(data.feedback_score) > 0"
                    class="text-gray-800 font-medium"
                  >
                    {{ data.feedback_score }}
                  </span>
                  <span
                    v-else
                    class="text-gray-400 italic font-semibold"
                  >
                    No Feedback Yet
                  </span>
                </td>

       
                </tr>
              </tbody>
 
            </table>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-100 text-right">
            <button
              @click="closeModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 hover:scale-105 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>

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

        <!-- Centered Submit All Button -->
        <div class="flex justify-center items-center my-6">
        <button
            @click="submitAllSalesEvaluation"
            :disabled="!canSubmitAll"
            :class="[
            'py-2 px-6 rounded-lg text-lg font-semibold transition-colors',
            canSubmitAll
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-400 text-white cursor-not-allowed'
            ]"
        >
            Submit All
        </button>
        </div>


    </div>
  </div>
</template>
  
  <script setup>
  
  definePageMeta({
    middleware: ['auth', 'adminmanager']
  })
  
  import { ref, computed } from 'vue';
  import { onMounted } from 'vue';




  
  const router = useRouter();
  const route = useRoute();
  
  
  const query = route.query;
  // const month = ref(null)
  // const year = ref(null)
  
  //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()
  
    const currentUser = authStore.state.user 

    const showModal = ref(false);
    const modalType = ref('add');
    const modalData = ref(null);





    // Months for the dropdown
  const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
         ];





    if(!query.month){
        query.month = months[new Date().getMonth()]
    }

    if(!query.year){
        query.year = new Date().getFullYear()
    }

   
  
    const today = new Date()
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

   const useFeedbackStore  = feedbackStore()

   const useManageSalesStore = useManageSalesAgentStore();

   const fetchSalesAgentsEvaluation = (query) => {
    useManageSalesStore.fetchSalesEvaluation(query) 
   };


  const config = useRuntimeConfig()
  
  const updateImageLink = (imageLink) => {
        return `${config.public.imageBaseUrl}${imageLink}`
  }

     const submitSalesEvaluation = async (agent) => {
    // if (agent.submitted === 0 && agent.ready_to_submit) {
    //   agent.submitted = 1; // Mark as submitted
    // } else if (agent.submitted === 1) {
    //   agent.submitted = 0; // Toggle back (just for demo)
    // }

    await useManageSalesStore.submitSalesEvaluation(agent.id, {
        agent_id: agent.id,
        agent_dbname: agent.db_name,
        month: agent.month,
        year: agent.year,
        date: date,
        submitted: 1
    });
  }

const submitAllSalesEvaluation = async() => {
  agents.value.forEach(agent => {
    if (agent.ready_to_submit && agent.submitted === 0) {
      agent.submitted = 1;
    }
  });

   const payload = agents.value.map(agent => ({
        agent_id: agent.id,
        agent_dbname: agent.db_name,
        month: agent.month,
        year: agent.year,
        date: date,
        submitted: 1
    }));

    await useManageSalesStore.submitSalesEvaluation('all', payload
);
};


const  reviewSalesEvaluation = async (agent) => {
 

   // Call the store action to review sales evaluation
   await useManageSalesStore.reviewSalesEvaluation(agent.id, {
       month: agent.month,
       year: agent.year
   });
}



const openModal = ( data) => {
    
        showModal.value = true;
   
        modalData.value = data;
      };
      
      const closeModal = () => {
        showModal.value = false;
        
      };      

 
  onMounted(() => {
    fetchSalesAgentsEvaluation(query);
  
  });
  
  const itemsPerPage = 10;
  const currentPage = ref(1);
  const isModalOpen = ref(false);
  const isModalOpenForLogin = ref(false)
  const  enablePasswordRecovery = ref(false)
  const editMode = ref(false); // Toggle between Add and Edit mode
  const editLoginMode = ref(false); // Toggle between Add and Edit mode for login
  const imagePreview = ref(null);
  

  

  const agents = computed(() => useManageSalesStore.state.salesAgentEvaluation);

  const totalPages = computed(() =>
    Math.ceil(agents.value.length / itemsPerPage)
  )
  
  const paginatedAgents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return agents.value.slice(start, end);
  });

// Computed: enable button only if all agents are ready
    const canSubmitAll = computed(() =>
    agents.value.length > 0 &&
    agents.value.every(agent => agent.ready_to_submit )
    );

   


 watch(route, (newRoute) => {
   fetchSalesAgentsEvaluation(newRoute.query);

});

  </script>
  