<template>
    <div>
      <div class="overflow-x-auto" id="print-table">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>

            <tr class="bg-green-600 text-white">
              <th class="border border-gray-300 px-4 py-2"></th>
              <th class="border border-gray-300 px-4 py-2"></th>
              <th class="border border-gray-300 px-4 py-2"></th>
              <th colspan="2" class="border border-gray-300 px-4 py-2">Performance (80%)</th>
              <th colspan="3" class="border border-gray-300 px-4 py-2">Attendance (10%)</th>
              <th colspan="3" class="border border-gray-300 px-4 py-2">Memo and Feedback (10%)</th>
              <th colspan="2" class="border border-gray-300 px-4 py-2">Additional Points (10%)</th>
              <th class="border border-gray-300 px-4 py-2"></th>
              <th class="border border-gray-300 px-4 py-2"></th>
            </tr>
            <tr class="bg-green-500 text-white">
              <th class="border border-gray-300 px-4 py-2">Year</th>
              <th class="border border-gray-300 px-4 py-2">Month</th>
              <th class="border border-gray-300 px-4 py-2">Employee Name</th>
              <th class="border border-gray-300 px-4 py-2">Score</th>
              <th class="border border-gray-300 px-4 py-2">Total</th>
              <th class="border border-gray-300 px-4 py-2">Absences</th>
              <th class="border border-gray-300 px-4 py-2">Tardiness</th>
              <th class="border border-gray-300 px-4 py-2">Total</th>
              <th class="border border-gray-300 px-4 py-2">Memo-score</th>
              <th class="border border-gray-300 px-4 py-2">Feedback-score</th>
              <th class="border border-gray-300 px-4 py-2">Total</th>
              <th class="border border-gray-300 px-4 py-2">New Deposit</th>
              <th class="border border-gray-300 px-4 py-2">Total</th>
              <th class="border border-gray-300 px-4 py-2">Grand Total</th>
              <th class="border border-gray-300 px-4 py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-green-50 even:bg-white" v-for="agent in agents" :key="agent.id">
              <td class="border border-gray-300 px-4 py-2 capitalize">{{ agent.year }}</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">{{ agent.month }}</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">{{ agent.db_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.shipok_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.performance_rating }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.absence_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.tardiness_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ totalTheRating(agent.absence_rating, agent.tardiness_rating) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.memo_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.feedback_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ totalTheRating(agent.memo_rating, agent.feedback_rating) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.deposit_score }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.additional_points }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ agent.final_ratings }}</td>
              <td class="border border-gray-300 px-4 py-2 font-bold" :class="setRatingNameColor(agent)">{{ agent.ratings_name }}</td>

            </tr>
           
            <!-- Additional rows can be added here -->
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <script setup>
      import printJS from "print-js";

      const printTable = () => {
          const printContent = document.getElementById("print-table").innerHTML;
          const originalContent = document.body.innerHTML;

          document.body.innerHTML = printContent;
          window.print();
          document.body.innerHTML = originalContent;
      };

      const props = defineProps({
            agents : {
                type: Array
            }
        })

      const totalTheRating = (rating1, rating2) =>{
            return  Number(rating1) + Number(rating2)
        }

      const setRatingNameColor = (agent) => {
          if (agent.ratings_name == 'EXCEPTIONAL') {
            return 'text-purple-700'
          }
          
          if (agent.ratings_name == 'VERY SATISFACTORY') {
            return 'text-blue-700'
          }

          if (agent.ratings_name == 'SATISFACTORY') {
            return 'text-green-700'
          }
          if (agent.ratings_name == 'NEEDS IMPROVEMENT') {
            return 'text-yellow-700'
          }

          if (agent.ratings_name == 'POOR') {
            return 'text-red-700'
          }
        }

</script>
  
  <style scoped>
      /* Ensure text resizes to fit within the cells */
      table {
        table-layout: auto;
      }
      th, td {
        font-size: 0.875rem; /* Tailwind's text-sm */
        white-space: normal; /* Allow text wrapping */
      }

      @media print {
      body * {
        visibility: hidden;
      }
      #print-table, #print-table * {
        visibility: visible;
      }
      #print-table {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    }
  </style>
  