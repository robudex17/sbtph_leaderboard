<template>
  <div class="grid grid-cols-1 gap-4 p-4 mt-20">

    <div v-if="customSeachStore.state.loading">
      <spinner></spinner>
    </div>

    <div v-else>
      <div v-if="currentUser.login_type == 'standarduser' && data.length > 0">
        <p class="text-gray-800 font-bold text-3xl mb-2 text-center">
          Agent Monthly Target
        </p>

        <table class="w-full table-auto border-collapse bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800">
              <th class="py-2 px-2 border text-center font-bold">ID</th>
              <th class="py-2 px-2 border text-center font-bold">Name</th>
              <th class="py-2 px-2 border text-center font-bold">Employee Status</th>
              <th class="py-2 px-2 border text-center font-bold">Market</th>
              <th class="py-2 px-2 border text-center font-bold">Team</th>
              <th class="py-2 px-2 border text-center font-bold">Month</th>
              <th class="py-2 px-2 border text-center font-bold">Year</th>
              <th class="py-2 px-2 border text-center font-bold">Target</th>
              <th class="py-2 px-2 border text-center font-bold">Shipok</th>
              <th class="py-2 px-2 border text-center font-bold">Percentage(%)</th>
              <th class="py-2 px-1 border text-center font-bold">
                <div class="flex items-center justify-center gap-2">
                  <span>Remaining Units</span>
                  <div class="flex-shrink-0">
                    <export-to-excel-component
                      v-if="isAdmin && data?.length > 0"
                      :exportUrl="exportUrl"
                      :exportFileName="exportFileName"
                      :query="query"
                      :token="token"
                      :incomplete="incomplete"
                      class="!text-white !text-[8px] !px-1 !py-1 !rounded !hover:bg-green-600 !transition-all !duration-200"
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="agent in paginatedAgents"
              :key="agent.agent_id"
              class="even:bg-blue-50 odd:bg-white"
            >
              <td class="py-1 px-2 border text-center text-gray-700">
                {{ agent.id }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700">
                <div class="flex items-center space-x-2">
                  <img
                    v-if="agent && agent.image_link"
                    :src="updateImageLink(agent.image_link)"
                    alt="Agent Image"
                    class="w-9 h-9 rounded-full object-cover shadow"
                  />
                  <span>{{ agent?.db_name }}</span>
                </div>
              </td>

              <td
                class="py-1 px-2 border text-center text-gray-700"
                :class="{
                  'text-red-600 font-bold': agent.employee_status === 'Resigned',
                  'text-green-600 font-bold': agent.employee_status === 'Hired' || agent.employee_status === 'Rehired'
                }"
              >
                {{ agent?.employee_status }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700">
                {{ agent?.market_name?.toUpperCase?.() ?? '' }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700">
                {{ agent?.team_name }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700">
                {{ agent.month }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700">
                {{ agent.year }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700 font-bold">
                {{ agent.target }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700 font-bold">
                {{ agent.shipok }}
              </td>

              <td class="py-1 px-2 border text-center text-gray-700 font-bold">
                {{ getWholeNumberPercentage(agent.target, agent.shipok) }}
              </td>

              <td
                class="py-1 px-2 border text-center text-gray-700 font-bold"
                :class="(agent.target - agent.shipok) >= 0 ? 'text-red-600 border' : 'text-green-600'"
              >
                {{ agent.target - agent.shipok }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Pagination -->
        <div
          v-if="totalPages > 1"
          class="mt-4 flex justify-center space-x-4 mb-2"
        >
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

      <div v-else class="text-red-700 font-bold text-5xl text-center">
        No Available Data.
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'adminmanager']
})

import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import API from '~/utils/api'

const authStore = useAuthStore()
authStore.fetchTokenFromLocalStore()

const router = useRouter()
const route = useRoute()
const currentUser = authStore.state.user
const token = authStore.state.token
const month = ref('')
const year = ref('')
const isAdmin = ref(false)
const query = ref('')

const exportUrl = API.export.sales_agents_target_export
const searchType = route.params.search_type

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

month.value = route.query.month || months[new Date().getMonth()]
year.value = route.query.year || new Date().getFullYear()

// Store
const customSeachStore = useCustomSearchStore()
const data = computed(() => customSeachStore.state.customSearch)

// ✅ Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(data.value.length / itemsPerPage.value)
)

const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return data.value?.slice(start, end)
})

if (currentUser.role == 'poweruser' || currentUser.role == 'admin') {
  isAdmin.value = true
}

const exportFileName = computed(() => {
  return `agents-${month.value}-${year.value}-target.xlsx`
})

// ✅ Fetch function (clears old data properly)
const fetchCustomSearchData = async (searchType, query) => {
  customSeachStore.state.customSearch = [] // clear before fetch
  customSeachStore.state.loading = true
  await customSeachStore.fetchCustomSearch(searchType, query)
  customSeachStore.state.loading = false
  currentPage.value = 1 // reset pagination
}

// ✅ Config for image URL
const config = useRuntimeConfig()
const updateImageLink = (imageLink) => {
  return `${config.public.imageBaseUrl}${imageLink}`
}

// ✅ Initial fetch
onMounted(() => {
  fetchCustomSearchData(searchType, route.query)
})

// ✅ Watch route change only when query changes
watch(
  () => route.fullPath,
  (newRoute, oldRoute) => {
    if (newRoute !== oldRoute) {
      fetchCustomSearchData(searchType, route.query)
    }
  }
)




// ✅ Reset page when data changes
watch(data, () => {
  currentPage.value = 1
})

const getWholeNumberPercentage = (target, shipok) => {
  if (Number(target) != 0 && Number(shipok) != 0) {
    const percentage = ((shipok / target) * 100).toFixed(2)
    const roundOff = Math.round(percentage)
    return roundOff + '%'
  }
  return '0%'
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
