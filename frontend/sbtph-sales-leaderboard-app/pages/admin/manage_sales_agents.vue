<template>
    <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">Sales Agents Information</h1>
  
      <!-- Add Agent Button -->
      <button
        class="mb-6 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        @click="isModalOpen = true"
      >
        Add Agent
      </button>
  
      <!-- Add Agent Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold text-gray-700 mb-4">Add New Agent</h2>
          <form @submit.prevent="addAgent">
            <div class="grid grid-cols-1 gap-4">
              <input type="text" v-model="newAgent.firstname" placeholder="First Name" class="p-2 border rounded" required />
              <input type="text" v-model="newAgent.lastname" placeholder="Last Name" class="p-2 border rounded" required />
              <input type="text" v-model="newAgent.manager_id" placeholder="Manager ID" class="p-2 border rounded" required />
              <input type="text" v-model="newAgent.agent_type" placeholder="Agent Type" class="p-2 border rounded" required />
              <input type="text" v-model="newAgent.db_name" placeholder="Database Name" class="p-2 border rounded" required />
              <input type="url" v-model="newAgent.image_link" placeholder="Image Link" class="p-2 border rounded" required />
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                class="px-4 py-2 bg-gray-400 text-white font-bold rounded hover:bg-gray-500"
                @click="isModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
              >
                Add Agent
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
              <th class="py-4 px-6 border font-semibold uppercase">Manager ID</th>
              <th class="py-4 px-6 border font-semibold uppercase">Agent Type</th>
              <th class="py-4 px-6 border font-semibold uppercase">First Name</th>
              <th class="py-4 px-6 border font-semibold uppercase">Last Name</th>
              <th class="py-4 px-6 border font-semibold uppercase">Database Name</th>
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
                {{ agent.manager_id }}
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
                    @click="editAgent(agent.id)"
                  >
                    Edit
                  </button>
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
  
  <script setup >
  import { ref, computed } from 'vue';
  import { useManageSalesAgentStore} from '../../stores/manage_sales_agents'
  import { onMounted } from 'vue'
  
  const manageSalesAgentStore  = useManageSalesAgentStore()
  
  const  fetchSalesAgents = () => {
    manageSalesAgentStore.fetchSalesAgents()
  }
  
   onMounted(() => {
        fetchSalesAgents()
    })
  
  
  
      const itemsPerPage = 10;
      const currentPage = ref(1);
      const isModalOpen = ref(false);
      const agents = computed(() => {
        return manageSalesAgentStore.state.salesAgents
      })
     
      console.log(`agents- ${agents}`)
  
      const totalPages = computed(() =>
        Math.ceil(agents.value.length / itemsPerPage)
      );
  
      const paginatedAgents = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return agents.value.slice(start, end);
      });
  
      const addAgent = () => {
        const newId = agents.value.length
          ? Math.max(...agents.value.map((a) => a.id)) + 1
          : 1;
        agents.value.push({ id: newId, ...newAgent.value });
        newAgent.value = {
          firstname: "",
          lastname: "",
          manager_id: "",
          agent_type: "",
          db_name: "",
          image_link: "",
        };
        isModalOpen.value = false;
        currentPage.value = totalPages.value;
      };
  
      const editAgent = (id) => {
        alert(`Edit functionality for agent ID: ${id}`);
      };
  
      const deleteAgent = (id) => {
        agents.value = agents.value.filter((agent) => agent.id !== id);
        if (currentPage.value > totalPages.value)
          currentPage.value = totalPages.value;
      };
  
     
  
  </script>
  