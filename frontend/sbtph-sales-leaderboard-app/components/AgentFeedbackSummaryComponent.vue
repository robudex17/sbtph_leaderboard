<template>
    <div>
    <h1 class="text-2xl font-bold mb-4 text-center">Agent Feedback Information</h1>    
    <div class="overflow-x-auto">
   
      <table class="min-w-full border border-green-500 rounded-lg">
        <thead class="bg-green-200">
          <tr>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Agent ID</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Name</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Status</th>
            <!-- <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Agent Type</th> -->
            <!-- <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Manager</th> -->
            <!-- <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Market ID</th> -->
            <!-- <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Market Name</th> -->
        
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900" v-if="agents[0].agent_type == 1">Feeback From Agents</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900" v-if="agents[0].agent_type == 1 || agents[0].agent_type == 0">Feeback From Manager</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900" v-if="agents[0].agent_type == 2">Feeback From LM</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Feeback From QA</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Overall Feeback</th>
            <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Photo</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            :key="agent.id" 
            v-for="agent in agents" 
            :class="['odd:bg-white', 'even:bg-green-50']">
            <td class="py-2 px-4 text-sm text-green-800">{{ agent.id }}</td>
            <td class="py-2 px-4 text-sm text-green-800 font-bold">{{ agent.firstname }} {{ agent.lastname }}</td>
            <td class="py-2 px-4 text-sm text-green-800">
              <span :class="['status', agent.status]">{{ agent.status }}</span>
            </td>
          
             <td  class="py-2 px-4 text-sm  text-center font-bold"
                 :class="averageManagerFeedback && averageManagerFeedback !== 0 ? 'text-green-800' : 'text-red-600'"
                v-if="agents[0].agent_type == 1 "> {{averageManagerFeedback ?  averageManagerFeedback : 'No Feedback'}}
             </td>

             <td  class="py-2 px-4 text-sm text-center font-bold" 
              :class=" averageLmsFeedback &&  averageLmsFeedback !== 0 ? 'text-green-800' : 'text-red-600'"
              v-if="agents[0].agent_type == 1 ">{{ averageLmsFeedback ? averageLmsFeedback : 'No Feedback' }}
            </td>
             <td  
             class="py-2 px-4 text-sm text-center font-bold" 
             :class=" averageAgentFeedback &&  averageAgentFeedback !== 0 ? 'text-green-800' : 'text-red-600'"
             v-if="agents[0].agent_type == 0 ">{{ averageAgentFeedback ?  averageAgentFeedback : 'No Feedback' }}
            
            </td>
             <td  class="py-2 px-4 text-sm text-center font-bold"
             :class=" averageAgentFeedback &&  averageAgentFeedback !== 0 ? 'text-green-800' : 'text-red-600'"
             v-if="agents[0].agent_type == 2">{{ averageManagerFeedback ? averageManagerFeedback : 'No Feedback' }}</td>

             <td  class="py-2 px-4 text-sm text-center font-bold"
              :class="averageFeedbackByQa &&  averageFeedbackByQa !== 0 ? 'text-green-800' : 'text-red-600'"
             >
              {{ averageFeedbackByQa ?averageFeedbackByQa : 'No Feedback' }}
             </td>

             
             <td 
              class="py-2 px-4  text-sm text-center font-bold"
              :class=" overallAverageFeedback && overallAverageFeedback !== 0 ? 'text-purple-800' : 'text-red-600'"
             >{{ overallAverageFeedback ? overallAverageFeedback : 'No Feedback' }}</td>
            
            <td class="py-2 px-4 text-sm text-green-800">
              <div class="agent-photo">
                <img v-if="agent.image_link" :src="agent.image_link" alt="Agent Photo" class="rounded-full w-12 h-12 object-cover">
                <span v-else class="text-sm text-gray-500">No Photo</span>
              </div>
            </td>
 
          </tr>
        </tbody>
      </table>
    </div>
   </div> 
  </template>
  
  <script setup>
  import { ref,defineProps } from 'vue';

  const props = defineProps({

    agents: {
        type: Array,
        required: true,
    },

    averageAgentFeedback: {
        type: Number,
        required: true,
    },

    averageManagerFeedback: {
        type: Number,
        required: true,
    },

    averageLmsFeedback: {
        type: Number,
        required: true,
    },

    averageFeedbackByQa: {
      type: Number,
      required: true,
    },

    overallAverageFeedback: {
        type: Number,
        required: true,
    },
 
 
});
  

  </script>
  
  <style scoped>
    .status {
            font-weight: bold;
    }
  
    .status.active {
        color: #4caf50;
    }
    
    .status.inactive {
        color: #f44336;
    }
    
    .agent-photo {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .agent-photo img {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
    }
    
    .agent-photo span {
        font-size: 0.875rem;
        color: #777;
    }

  </style>
  