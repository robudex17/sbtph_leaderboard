<template>
    <div class="mt-20 px-4">
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-green-600 text-white">
              <th class="border border-gray-300 px-4 py-2"></th>
              <th class="border border-gray-300 px-4 py-2"></th>
              <th class="border border-gray-300 px-4 py-2"></th>
              <th colspan="2" class="border border-gray-300 px-4 py-2">Performance (80%)</th>
              <th colspan="3" class="border border-gray-300 px-4 py-2">Attendance (10%)</th>
              <th colspan="3" class="border border-gray-300 px-4 py-2">Memo and Feedback (10%)</th>
              <th colspan="2" class="border border-gray-300 px-4 py-2">Additional Points</th>
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
            <tr class="odd:bg-green-50 even:bg-white">
              <td class="border border-gray-300 px-4 py-2 capitalize">2021</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">February</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">Rustan</td>
              <td class="border border-gray-300 px-4 py-2">2.00</td>
              <td class="border border-gray-300 px-4 py-2">1.60</td>
            </tr>
            <tr class="odd:bg-green-50 even:bg-white">
              <td class="border border-gray-300 px-4 py-2 capitalize">2021</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">February</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">Paula</td>
              <td class="border border-gray-300 px-4 py-2">2.00</td>
              <td class="border border-gray-300 px-4 py-2">1.60</td>
            </tr>
            <tr class="odd:bg-green-50 even:bg-white">
              <td class="border border-gray-300 px-4 py-2 capitalize">2021</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">February</td>
              <td class="border border-gray-300 px-4 py-2 capitalize">Floyd</td>
              <td class="border border-gray-300 px-4 py-2">2.00</td>
              <td class="border border-gray-300 px-4 py-2">1.60</td>
            </tr>
            <!-- Additional rows can be added here -->
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Ensure text resizes to fit within the cells */
  table {
    table-layout: auto;
  }
  th, td {
    font-size: 0.875rem; /* Tailwind's text-sm */
    white-space: normal; /* Allow text wrapping */
  }
  </style>
  