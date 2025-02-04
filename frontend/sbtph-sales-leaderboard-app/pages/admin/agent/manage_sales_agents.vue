<template>
  <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">Sales Agents Information</h1>

    <!-- Add Agent Button -->
    <button
      class="mb-6 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      @click="openAddAgentModal"
    >
      Add Agent
    </button>

    <!-- Add/Edit Agent Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold text-gray-700 mb-4">
          {{ editMode ? 'Edit Agent' : 'Add New Agent' }}
        </h2>
        <form @submit.prevent="editMode ? updateAgent() : addAgent()">
          <div class="grid grid-cols-1 gap-4 overflow-y-auto max-h-80">
            <!-- Form fields go here -->
            <label for="id" class="font-semibold text-gray-600">Agent ID</label>
            <input
              id="id"
              type="text"
              v-model="currentAgent.id"
              placeholder="Agent ID"
              class="p-2 border rounded"
              :readonly="editMode"
              required
            />

            <label for="firstname" class="font-semibold text-gray-600">First Name</label>
            <input
              id="firstname"
              type="text"
              v-model="currentAgent.firstname"
              placeholder="First Name"
              class="p-2 border rounded"
              required
            />

            <label for="lastname" class="font-semibold text-gray-600">Last Name</label>
            <input
              id="lastname"
              type="text"
              v-model="currentAgent.lastname"
              placeholder="Last Name"
              class="p-2 border rounded"
              required
            />

            <!-- <label for="manager_id" class="font-semibold text-gray-600">Manager ID</label>
            <input
              id="manager_id"
              type="text"
              v-model="currentAgent.manager_id"
              placeholder="Manager ID"
              class="p-2 border rounded"
              required
            /> -->

                     <!-- Market Dropdown -->
          <label for="manager" class="font-semibold text-gray-600">Manager</label>
          <select
            id="manager_name"
            v-model="currentAgent.manager_id"
            placeholder="Manager ID"
            class="p-2 border rounded"
            required
            
          >
           <option  v-for="manger in managers" :key="manger.id" :value="manger.id">{{ manger.db_name }}</option>
           
          </select>

            <label for="agent_type" class="font-semibold text-gray-600">Agent Type</label>
            <input
              id="agent_type"
              type="text"
              v-model="currentAgent.agent_type"
              placeholder="Agent Type"
              class="p-2 border rounded"
              required
            />

            <label for="db_name" class="font-semibold text-gray-600">Database Name</label>
            <input
              id="db_name"
              type="text"
              v-model="currentAgent.db_name"
              placeholder="Database Name"
              class="p-2 border rounded"
              required
            />

                <!-- Market Dropdown -->
          <label for="market_name" class="font-semibold text-gray-600">Market</label>
          <select
            id="market_name"
            v-model="currentAgent.market_id"
            class="p-2 border rounded"
            required
               
          >
          <option  v-for="market in markets" :key="market.id" :value="market.id">{{ market.market_name }}</option>
           
          </select>

            <label for="image" class="font-semibold text-gray-600">Image Photo</label>
            <input
              id="image"
              type="file"
              @change="handleFileUpload"
              class="p-2 border rounded"
            />
            <div v-if="imagePreview" class="mt-2">
              <img
                :src="imagePreview"
                alt="Agent Image"
                class="w-24 h-24 rounded-full border border-blue-200 mx-auto"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              class="px-4 py-2 bg-gray-400 text-white font-bold rounded hover:bg-gray-500"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
            >
              {{ editMode ? 'Update Agent' : 'Add Agent' }}
            </button>
          </div>
        </form>
      </div>
    </div>

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
                <button
                  class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
                  @click="openEditAgentModal(agent)"
                >
                <i class="fas fa-edit"></i>
                  Edit
                </button>
                <NuxtLink
                  :to="{
                    path: `/admin/agent/${agent.id}/details`,
                    
                  }"
                  class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                  Details
                </NuxtLink>
                <button
                  class="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
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
import { ref, computed } from 'vue';
import { useManageSalesAgentStore } from '../../../stores/manage_sales_agents';
import { onMounted } from 'vue';

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
const editMode = ref(false); // Toggle between Add and Edit mode
const imagePreview = ref(null);
const currentAgent = ref({
  id: '',
  firstname: '',
  lastname: '',
  manager_id: '',
  agent_type: '',
  db_name: '',
  market_id: '',
  manager_name: '',
  image: '',
});

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

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
      currentAgent.value.image = file;
     
    };
    reader.readAsDataURL(file);
  }
};

const openAddAgentModal = () => {
  editMode.value = false;
  resetCurrentAgent();
  isModalOpen.value = true;
};

const openEditAgentModal = (agent) => {
  editMode.value = true;
  Object.assign(currentAgent.value, agent);
  imagePreview.value = agent.image_link;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const resetCurrentAgent = () => {
  currentAgent.value = {
    id: '',
    firstname: '',
    lastname: '',
    manager_id: '',
    agent_type: '',
    db_name: '',
    market_id: '',
    manager_name: '',
    image: '',
  };
  imagePreview.value = null;
};

const addAgent = async() => {
  try {
    await manageSalesAgentStore.addSalesAgent(currentAgent.value);
    closeModal();
  }catch(error){
    console.error('Error in adding new sales agent', error)
  }
  
  
};

const updateAgent = () => {
  
  manageSalesAgentStore.updateSalesAgent(currentAgent.value);
  closeModal();
};

const deleteAgent = async(id) => {
  try {
    await  manageSalesAgentStore.deleteSalesAgent(id);
  }catch(error){
    console.error(`Error in deleting sales agent id: ${id}`, error)
  }
 
};
</script>
