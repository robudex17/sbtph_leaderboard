<template>
  <div class="p-4 space-y-6">
    <div v-for="table in tables" :key="table.id" class="border p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">{{ table.title }}</h2>
      <button
        @click="toggleTable(table.id)"
        class="mb-4 mt-2 px-1 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-bold"
      >
        {{ showTable[table.id] ? 'Hide Breakdown' : 'Show Breakdown' }}
      </button>

      <transition name="fade">
        <div v-if="showTable[table.id]" class="overflow-x-auto">
         <h1>Agent Breakdown</h1>
          <table class="min-w-full border text-left bg-white rounded shadow">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border">Agent ID</th>
                <th class="p-2 border">Name</th>
                <th class="p-2 border">Target</th>
                <th class="p-2 border">Ship OK</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in table.data" :key="row.id">
                <td class="p-2 border">{{ row.id }}</td>
                <td class="p-2 border">{{ row.name }}</td>
                <td class="p-2 border">{{ row.target }}</td>
                <td class="p-2 border">{{ row.shipOk }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
definePageMeta({
  layout: 'custom' ,// This tells Nuxt to use the 'custom' layout for this page
//   middleware: ['auth'] 
})
// Sample data
const tables = ref([
  {
    id: 1,
    title: 'Market A',
    data: [
      { id: 2856, name: 'John Doe', target: 12, shipOk: 10 },
      { id: 2857, name: 'Jane Smith', target: 8, shipOk: 6 },
    ]
  },
  {
    id: 2,
    title: 'Market B',
    data: [
      { id: 3001, name: 'Mark Lee', target: 10, shipOk: 9 }
    ]
  },
    {
    id: 3,
    title: 'Market C',
    data: [
      { id: 3001, name: 'Mark Lee', target: 10, shipOk: 9 },
       { id: 2856, name: 'John Doe', target: 12, shipOk: 10 },
      { id: 2857, name: 'Jane Smith', target: 8, shipOk: 6 },
    ]
  }
])

// Reactive object to track which tables are shown
const showTable = reactive({})

onMounted(() => {
  // Initialize all to false
  tables.value.forEach(table => {
    showTable[table.id] = false
  })
})

const toggleTable = (id) => {
  showTable[id] = !showTable[id]
}
</script>

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

v-if="currentUser.role == 'user' || (currentUser.agent_type == 1 && currentUser.role =='manager')"