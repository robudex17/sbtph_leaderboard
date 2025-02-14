<template>
    <div >
      <h1 class="text-2xl font-bold mb-4 text-center">Sales Agent Target/ShipOk</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-green-500 rounded-lg">
          <thead class="bg-green-200">
            <tr>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Agent ID</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Month</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Year</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Date</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">TARGET</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">SHIPOK</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">PERCENTAGE</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">MARKET ID</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Market Name</th>
              <th class="py-2 px-4 text-left text-sm font-medium text-green-900 flex justify-between items-center">
                Actions
                <button :disabled="targetShipokDetails.length===1 || currentUser.role == 'user'" class="disabled:bg-gray-400 disabled:cursor-not-allowed"
                  @click="openModal('add')" 
                  :class="hasTarget">
                  <font-awesome-icon icon="plus" />
                  Add 
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
            v-for="(targetShipokDetail, index) in targetShipokDetails" 
            :key="targetShipokDetails.id + index" 
              class="odd:bg-white even:bg-green-50">
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.agent_id }}</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.month }}</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.year }}</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.date }}</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.target }}</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.ship_ok }}</td>
              <td class="py-2 px-4 text-sm text-green-800 font-bold"
              :class="{
                'text-red-500': percentage(targetShipokDetail) <= 50,
                'text-green-500': percentage(targetShipokDetail) >= 51 && percentage(targetShipokDetail) <= 100,
                'text-purple-500': percentage(targetShipokDetail) > 100
              }"
              >{{ percentage(targetShipokDetail)}}%</td>
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.market_id }}</td> 
              <td class="py-2 px-4 text-sm text-green-800">{{ targetShipokDetail.market_name}}</td>
              <td class="py-2 px-4 text-sm text-green-800 flex gap-2">
                <button :disabled="currentUser.role == 'user'"
                  @click="openModal('edit', index)" 
                  class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Edit
                </button>
                <button  :disabled="currentUser.role == 'user'"
                  @click="deleteTarget(targetShipokDetail.agent_id, targetShipokDetail.date)" 
                  class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600  disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
          <h2 class="text-xl font-bold mb-4">{{ modalType === 'add' ? `Add  Target/Shipok`  : `Edit Target/Shipok` }}</h2>
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Agent ID</label>
              <input v-model="form.agent_id" type="number" class="w-full border rounded-lg p-2" disabled required />
            </div>
 

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">MOnth</label>
          <input type="text" class="w-full border rounded-lg p-2" v-model="form.month" disabled required />
        </div>
        <!-- Year Field - Current Year -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Year</label>
          <input type="text" class="w-full border rounded-lg p-2" v-model="form.year" disabled required />
        </div>
   
            <div class="mb-4" >
              <label class="block text-sm font-medium mb-2">Target</label>
              <input v-model="form.target" type="text" class="w-full border rounded-lg p-2"  />
              <p v-if="errorTarget" class="text-red-500 text-sm mt-2">{{ errorTarget }}</p>
            </div>
            <div class="mb-4"  >
              <label class="block text-sm font-medium mb-2">ShipOk</label>
              <input v-model="form.ship_ok" type="text" class="w-full border rounded-lg p-2"  />
              <p v-if="errorShipOk" class="text-red-500 text-sm mt-2">{{ errorShipOk }}</p>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="closeModal" class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
              <button  :disabled="currentUser.role == 'user'"   type="submit" class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed"  >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits,computed, onMounted, watch } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()

    const currentUser = authStore.state.user 
  

  const route = useRoute()
  const router = useRouter()
  
  
  const props = defineProps({

    targetShipokDetails: {
        type: Object,
        required: true,
    },
    agent: {
      type: Object,
      required: true
    },
  
});

const showModal = ref(false);
const  errorTarget = ref("")
const errorShipOk = ref("")
const modalType = ref('add');
const month = ref(null)
const year = ref(null)


// Months for the dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



month.value= route.query.month
year.value = route.query.year 

if (month.value == null || month.value == ""){
  month.value= months[new Date().getMonth()]
}

if (year.value == null || year.value == ""){
  year.value = new Date().getFullYear()
}

const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const agent_id = route.params.agent_id
 const form = ref({
    agent_id: agent_id,
    month: month.value,
    year:  year.value,
    date: '',
    target: '',
    ship_ok: '',
    market_id: '',
   
  });

    // Validate Target input on every keystroke
    const validateTarget = () =>{
      if (form.value.target === "" || !/^\d+$/.test(form.value.target)) {
        errorTarget.value= "Please enter a valid whole number.";
      } else {
        errorTarget.value = "";
      }
    }

    // Validate Ship OK input on every keystroke
    const validateShipOk  = () => {
      if (form.value.ship_ok === "" || !/^\d+$/.test(form.value.ship_ok)) {
        errorShipOk.value = "Please enter a valid whole number.";
      } else {
        errorShipOk.value = "";
      }
    }

  const openModal = (type, index = null) => {
    modalType.value = type;
    showModal.value = true;

   
  
    if (type === 'edit' && index !== null) {
      validateTarget();
      validateShipOk();
    form.value = { ...props.targetShipokDetails[index]}
    } else {
      validateTarget();
      validateShipOk();
      form.value = {
       
        agent_id: agent_id,
        month: month.value,
        year:  year.value,
        date: date,
        target: '',
        ship_ok: '',
        market_id:  props.agent.market_id,
      };
    }
  
  };

  const closeModal = () => {
    showModal.value = false
    errorShipOk.value = ""
    errorTarget.value = ""
  }
  
  const percentage = ((data) => {
    
    return Math.ceil((Number(data.ship_ok) / Number(data.target)) * 100 * 100) / 100;
  })
  
  const emit = defineEmits(['passNewTarget', 'passUpdatedTarget', 'passDeleteTarget'])

  const submitForm = () => {
     // If there are any errors, do not proceed
    if (errorTarget.value || errorShipOk.value) {
      return;
    }

    if (modalType.value === 'add') {

    emit('passNewTarget', agent_id,{month:month.value, year:year.value}, form.value )

    } else if (modalType.value === 'edit') {

      emit('passUpdatedTarget', agent_id,{month:month.value, year:year.value}, form.value )
      closeModal();
    }
    closeModal();
  };
  
  const deleteTarget = (agent_id, target_date) => {
    if (confirm(`Are you sure you want to delete this target?`)) {

     emit('passDeleteTarget', agent_id, {month:month.value, year:year.value}, target_date )

    }
  };

  const hasTarget = computed(() => {
  return props.targetShipokDetails.length === 1 //if already has target
    ? 'ml-2 bg-gray-500 text-white py-1 px-3 rounded-lg flex items-center gap-2 cursor-not-allowed' // Disabled styles
    : 'ml-2 bg-green-500 text-white py-1 px-3 rounded-lg flex items-center gap-2 hover:bg-green-600'; // Enabled styles
});

watch(route, async (newRoute) => {
  console.log("The route is changed, reacting to the change..");
  router.push(newRoute.fullPath);
  month.value = newRoute.query.month 
  year.value = newRoute.query.year

});

// Watcher for the target field
watch(
  () => form.value.target,
  (newValue) => {
    // If empty or not a whole number, set error
    if (newValue === '' || !/^\d+$/.test(newValue)) {
      errorTarget.value = 'Please enter a valid whole number.';
    } else {
      errorTarget.value = '';
    }
  }
);

// Watcher for the ship_ok field
watch(
  () => form.value.ship_ok,
  (newValue) => {
    // If empty or not a whole number, set error
    if (newValue === '' || !/^\d+$/.test(newValue)) {
      errorShipOk.value = 'Please enter a valid whole number.';
    } else {
      errorShipOk.value = '';
    }
  }
);

  </script>
  
  <style>
  /* Add custom styles if needed */
  </style>
  