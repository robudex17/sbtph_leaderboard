<template>
  <div class="p-4">
    <!-- Use the Spinner component while loading -->
    <div v-if ="leaderBoardStore.state.loading">
        <spinner></spinner>
    </div>
    <div v-else>
        <div v-if="leaderBoardStore.state.error">{{leaderBoardStore.state.error}}</div>
        
        <!-- Use the spinner component while -->
    
        <div v-if="leaderBoardStore.state.leaderboard.length === 0">
                No data available.
        </div> 
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
            <div
                v-for="(player, index) in leaderBoardStore.state.leaderboard" 
                :key="index" 
                class="bg-gray-800 text-white border rounded-lg shadow-lg overflow-hidden"
            >
                `<div class="flex flex-col items-center p-4">
                <!-- Placeholder for image if not available -->
                <img 
                    v-if="player.image_link" 
                    :src="player.image_link" 
                    alt="Player Image" 
                    class="w-20 h-20 rounded-full object-cover mb-4"
                />
                <div v-else class="w-20 h-20 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-white">
                    <span class="text-xl">{{ player.db_name.charAt(0) }}</span>
                </div>
                <div class="text-center">
                    <h3 class="text-lg font-semibold">{{ player.db_name }}</h3>
                    <p class="text-sm text-gray-600">{{ player.ratings_name }}</p>

                    <!-- Star Rating -->
                    <div class="flex items-center mt-2">
                    <template v-for="i in 5" :key="i">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        :class="getStarClass(player.final_ratings, i)" 
                        width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                        >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                    </template>
                    </div>

                    <!-- Final Rating -->
                    <p class="text-xl font-bold mt-2">{{ player.final_ratings }}</p>
                </div>
                </div>
            </div>
        </div>        
     </div>
  </div>
</template>

<script setup>
import { useLeaderBoardStore } from '../stores/sales_leaderboard';
import { onMounted } from 'vue';
import Spinner  from '../components/spinner.vue'



const leaderBoardStore = useLeaderBoardStore();

 // Method to fetch users manually when the button is clicked
  const leaderBoardData = () => {
    leaderBoardStore.fetchLeaderboard(null)  // Trigger the store's fetch function
  }


const getStarClass = (rating, index) => {
  const fullStar = 'text-yellow-500';
  const halfStar = 'text-yellow-300';
  const emptyStar = 'text-gray-300';

  const decimalPart = rating - Math.floor(rating);
  if (index <= Math.floor(rating)) {
    return fullStar;
  } else if (index - 1 < decimalPart) {
    return halfStar;
  } else {
    return emptyStar;
  }
};


// Fetch leaderboard data on mount
onMounted(() => {
  leaderBoardData(); // You can pass a query string if needed
});
</script>
