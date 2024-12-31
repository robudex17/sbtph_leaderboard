<template>
    <div v-if="loading">
      <spinner></spinner>
    </div>
    <div v-else>
      <div v-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <div class="bg-gray-800 text-white p-4 rounded-lg">
          <h2 class="text-xl font-semibold">{{ agent.firstname }} {{ agent.lastname }}</h2>
          <p class="text-gray-500">DB Name: {{ agent.db_name }}</p>
          <p class="text-gray-500">Performance Rating: {{ agent.performance_rating }}</p>
          <p class="text-gray-500">Final Rating: {{ agent.final_ratings }}</p>
          <!-- Display other agent details as necessary -->
          <div v-if="agent.image_link">
            <img :src="agent.image_link" alt="Agent Image" class="w-24 h-24 rounded-full"/>
          </div>
          <div v-else class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white">
            <span class="text-xl">{{ agent.db_name.charAt(0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted ,computed} from 'vue';
  import { useRoute } from 'vue-router';
  import { useLeaderBoardStore } from '@/stores/sales_leaderboard';
  
  const route = useRoute();
  const leaderBoardStore = useLeaderBoardStore();
  
  const loading = ref(true);
  const error = ref('');
  
  // Fetch agent data based on the ID passed in the URL
  const fetchAgentDetails = async (id) => {
    try {
      await leaderBoardStore.fetchLeaderboard(); // Assuming this fetches the agent details
      loading.value = false;
    } catch (err) {
      error.value = 'Failed to load agent details';
      loading.value = false;
    }
  };

  const agentId = route.params.agent_id;
  const agent = computed(() => {
    return leaderBoardStore.state.leaderboard.find(agent => agent.id === agentId)
  })
  
  // Call the fetchAgentDetails function when the component is mounted
  onMounted(() => {
     // Get the agent ID from the route parameter;
    fetchAgentDetails(agentId)
    
  });
  </script>
  