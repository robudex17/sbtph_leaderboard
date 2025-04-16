<template>
    <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">Sales Agents Montly Performance  Information</h1>
    
        <!-- Agents Table -->
        <div class="overflow-x-auto shadow-xl rounded-lg">
          <table class="w-full table-auto border-collapse bg-white">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800">
                <th class="py-4 px-6 border font-semibold uppercase">ID</th>
                <th class="py-4 px-6 border font-semibold uppercase">Manager Name</th>
                <th class="py-4 px-6 border font-semibold uppercase">Agent Type</th>
                <th class="py-4 px-6 border font-semibold uppercase">First Name</th>
                <th class="py-4 px-6 border font-semibold uppercase">Last Name</th>
                <th class="py-4 px-6 border font-semibold uppercase">Database Name</th>
                <th class="py-4 px-6 border font-semibold uppercase">Market</th>
                <th class="py-4 px-6 border font-semibold uppercase">Image</th>
                <th class="py-4 px-6 border font-semibold uppercase">Actions</th>
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
                   {{ agent.manager_name }}
                </td>
                <td class="py-4 px-6 border text-center text-gray-700">
                   {{ agent.agent_type }}
                </td>
                <td class="py-4 px-6 border text-center text-gray-700">
                   {{ agent.firstname }}
                </td>
                <td class="py-4 px-6 border text-center text-gray-700">
                   {{ agent.lastname }}
                </td>
                <td class="py-4 px-6 border text-center text-gray-700">
                   {{ agent.db_name }}
                </td>
                <td class="py-4 px-6 border text-center text-gray-700">
                   {{ agent.market_name }}
                </td>
                <td class="py-4 px-6 border text-center">
                  <img
                    :src="agent.image_link"
                    alt="Agent Image"
                    class="h-12 w-12 rounded-full mx-auto border border-blue-200"
                  />
                </td>
                <td class="py-4 px-6 border text-center">
                  <div class="flex justify-center space-x-2">
                    <button :disabled="currentUser.role !=='admin'"
                      class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                      @click="openEditAgentModal(agent)"
                    >
                    <i class="fas fa-edit"></i>
                      Edit
                    </button>
                    <NuxtLink 
                      :to="{
                        path: `/admin/agent/${agent.id}/details`, query: { agent_type: agent.agent_type, agent_role: agent.role , agent_dbname: agent.db_name}
                        
                      }"
                      class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Details
                    </NuxtLink>
                    <button :disabled="currentUser.role !=='admin'"
                      class="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                      @click="openEditAgentLoginModal({login_id: agent.id, role: agent.role, status: agent.login_status, username: agent.username, agent_type: agent.agent_type})"
                    >
                      Login
                    </button>
                    <button :disabled="currentUser.role !=='admin'"
                      class="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600  disabled:bg-gray-400 disabled:cursor-not-allowed"
                      @click="deleteAgent(agent.id)"
                    >
                      Delete
                    </button>
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
  import { useManageSalesAgentStore } from '../../../stores/manage_sales_agents';
  import { onMounted } from 'vue';
  
  //get the current user
  const authStore = useAuthStore()
  authStore.fetchTokenFromLocalStore()
  
  const currentUser = authStore.state.user 
  
  
  const marketAgentStore =  useMarketStore()
  const manageSalesAgentStore = useManageSalesAgentStore()
  const managerStore = useManagerStore()
  
  const fetchSalesAgents = () => {
    manageSalesAgentStore.fetchSalesAgents();
  };
  
  const fetchAgentMarket = () => {
    marketAgentStore.fetchAgentMarket()
  }  
  
  const fetchMangers = () => {
    managerStore.fetchManagers()
  }
  onMounted(() => {
    fetchSalesAgents();
    fetchAgentMarket()
    fetchMangers()
  });
  
  const itemsPerPage = 10;
  const currentPage = ref(1);
  const isModalOpen = ref(false);
  const isModalOpenForLogin = ref(false)
  const  enablePasswordRecovery = ref(false)
  const editMode = ref(false); // Toggle between Add and Edit mode
  const editLoginMode = ref(false); // Toggle between Add and Edit mode for login
  const imagePreview = ref(null);
  
  const agents = computed(() => manageSalesAgentStore.state.salesAgents);
  const markets = computed(() =>marketAgentStore.state.market )
  const managers = computed(() => managerStore.state.managers)
  const totalPages = computed(() =>
    Math.ceil(agents.value.length / itemsPerPage)
  )
  
  const paginatedAgents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return agents.value.slice(start, end);
  });
  

  
  
  </script>
  