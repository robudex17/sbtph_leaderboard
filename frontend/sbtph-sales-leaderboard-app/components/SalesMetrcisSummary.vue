<template>
    <div >
        <h1 class="text-2xl font-bold mb-4 mt-8">Metrics Summary</h1>
 
        <div class="overflow-x-auto mb-4">
          <table class=" border border-green-500 rounded-lg">
            <thead class="bg-green-300">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-extrabold text-green-900">Metrics Type</th>
                <th class="py-2 px-4 text-left text-sm font-extrabold text-green-900">Count</th>
                <th class="py-2 px-4 text-left text-sm font-extrabold text-green-900">Month</th>
                <th class="py-2 px-4 text-left text-sm font-extrabold text-green-900">Year</th>
                <th class="py-2 px-4 text-left text-sm font-extrabold text-green-900">Score</th>
              </tr>
            </thead>
            <tbody v-for="agent in agents" :key="agent.id">
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">ShipOk</td>
                 <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.shipok  }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.shipok_score }}</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">New Deposit</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.deposit_score  || 0}} </td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.deposit_score  || 0}} </td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">Absences</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.absences}}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.absence_score  }}</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">Tardiness</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.tardiness }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.tardiness_score }}</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">Memo</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.memo }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.memo_score }}</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-green-800 font-semibold">Feedback</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.feedback_score }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800  font-semibold">{{ agent.feedback_score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  

    </div>
  </template>
  
  <script setup>
  const props = defineProps({
            agents : {
                type: Array
            }
        })
    const metrics = ref([
      {
        type: 'SHIPOK',
        count: 100,
        month: 'May',
        year: 2025,
        score: 4
      },
      {
        type: 'New Deposit',
        count: 100,
        month: 'May',
        year: 2025,
        score: 4
      }

    ]);
  </script>
  
  <style>
  /* Add custom styles if needed */
  </style>
  