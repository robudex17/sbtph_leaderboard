<script setup>
const data = [
  { market_id: 1, market_name: 'oceana', total_target: 100, total_ship_ok: 50 },
  { market_id: 2, market_name: 'malawi', total_target: 100, total_ship_ok: 200 },
  { market_id: 3, market_name: 'cyprus', total_target: 0, total_ship_ok: 0 },
  { market_id: 4, market_name: 'guyana', total_target: 0, total_ship_ok: 0 },
  { market_id: 5, market_name: 'jamaica', total_target: 0, total_ship_ok: 0 },
  { market_id: 6, market_name: 'bahamas', total_target: 0, total_ship_ok: 0 },
  { market_id: 7, market_name: 'kenya', total_target: 0, total_ship_ok: 0 },
  { market_id: 8, market_name: 'mozambique', total_target: 0, total_ship_ok: 0 },
  { market_id: 9, market_name: 'philippines', total_target: 0, total_ship_ok: 0 },
  { market_id: 10, market_name: 'trucks', total_target: 100, total_ship_ok: 200 }
];

const  dataNewDeposit =  [
  { market_id: 1, market_name: 'oceana', new_deposit: 100, total_ship_ok: 50 },
  { market_id: 2, market_name: 'malawi', new_deposit: 100, total_ship_ok: 200 },
  { market_id: 3, market_name: 'cyprus', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 4, market_name: 'guyana', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 5, market_name: 'jamaica', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 6, market_name: 'bahamas', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 7, market_name: 'kenya', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 8, market_name: 'mozambique', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 9, market_name: 'philippines', new_deposit: 0, total_ship_ok: 0 },
  { market_id: 10, market_name: 'trucks', new_deposit: 100, total_ship_ok: 200 }
];
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-4 mt-20">
    <p class="text-gray-800 font-bold text-7xl mb-10">Per Market Performance</p>
    <p class="text-gray-800 font-bold text-4xl">Target Vs ShipOk</p>
    
    <div v-for="market in data" :key="market.market_id" class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4">{{ market.market_name }}</h2>
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-blue-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
          <p class="text-gray-800 font-bold text-7xl">{{ market.total_target }}</p>
          <p class="text-gray-600 font-medium text-lg">Target(units)</p>
        </div>
        <div class="bg-green-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
          <p class="text-gray-800 font-bold text-7xl">{{ market.total_ship_ok }}</p>
          <p class="text-gray-600 font-medium text-lg">Ship OK(units)</p>
        </div>
        <div class="bg-yellow-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
          <p class="text-gray-800 font-bold text-6xl">
            {{ market.total_target > 0 ? ((market.total_ship_ok / market.total_target) * 100).toFixed(2) + '%' : '0%' }}
          </p>
          <p class="text-gray-600 font-medium text-lg">Percentage</p>
        </div>
        <div :class="(market.total_target - market.total_ship_ok) >= 0 ? 'bg-red-100' : 'bg-green-100'" class="p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
          <p class="text-gray-800 font-bold text-6xl">{{ market.total_target - market.total_ship_ok }}</p>
          <p class="text-gray-600 font-medium text-lg">Remaining(units)</p>
        </div>
      </div>
    </div>
    <p class="text-gray-800 font-bold text-4xl mt-5">New Deposit</p>
    
    <div v-for="market in  dataNewDeposit" :key="market.market_id" class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 class=" uppercase text-2xl font-semibold text-gray-800 mb-4 ">{{ market.market_name }}</h2>
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-blue-100 p-6 rounded-lg shadow flex flex-col items-center justify-center h-32">
          <p class="text-gray-800 font-bold text-7xl">{{ market.new_deposit }}</p>
          <p class="text-gray-600 font-medium text-lg">New Deposit(account)</p>
        </div>
 
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Additional styling can go here if needed */
</style>
