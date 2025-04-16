<template>
    <div >
        <h1 class="text-2xl font-bold mb-4 text-center">Sales Agent New Deposit</h1>
        <div class="overflow-x-auto">
          <table class="min-w-full border border-green-500 rounded-lg">
            <thead class="bg-green-200">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">ID</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Agent ID</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Month</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Year</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Date</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900">Description</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-green-900 flex justify-between items-center">
                  Actions
                  <button  :disabled="currentUser.role == 'user' || currentUser.agent_type == 1 || currentUser.agent_type == 0"
                    @click="openModal('add')" 
                    class="ml-2 bg-green-500 text-white py-1 px-3 rounded-lg flex items-center gap-2 hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <font-awesome-icon icon="plus" />
                    Add
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(newDeposit, index) in newDepositDetails" 
                :key="newDeposit.id + index" 
                class="odd:bg-white even:bg-green-50">
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.id }}</td>
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.agent_id }}</td>
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.month }}</td>
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.year }}</td>
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.date }}</td>
                <td class="py-2 px-4 text-sm text-green-800">{{ newDeposit.description }}</td>
                <td class="py-2 px-4 text-sm text-green-800 flex gap-2">
                  <button   :disabled="currentUser.role == 'user' || currentUser.agent_type == 1 || currentUser.agent_type == 0"
                    @click="openModal('edit', index)" 
                    class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Edit
                  </button>
                  <button   :disabled="currentUser.role == 'user' || currentUser.agent_type == 1 || currentUser.agent_type == 0 || currentUser.agent_type == 2"
                    @click="deleteNewDeposit(newDeposit.id , newDeposit.agent_id)" 
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
            <h2 class="text-xl font-bold mb-4">{{ modalType === 'add' ? `Add New Deposit`  : `Edit New Deposit` }}</h2>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Agent ID</label>
                <input v-model="form.agent_id" type="number" class="w-full border rounded-lg p-2" disabled required />
              </div>
              <div class="mb-4" >
                <label class="block text-sm font-medium mb-2">Month</label>
                <input v-model="form.month" type="text" class="w-full border rounded-lg p-2"  disabled required />
              </div>
              <div class="mb-4"  >
                <label class="block text-sm font-medium mb-2">Year</label>
                <input v-model="form.year" type="text" class="w-full border rounded-lg p-2" disabled  required />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Date</label>
                <input v-model="form.date" type="date" class="w-full border rounded-lg p-2" required />
                <p v-if="errorDate" class="text-red-500 text-sm mt-2">{{ errorDate }}</p>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Description</label>
                <textarea v-model="form.description" class="w-full border rounded-lg p-2" required></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <button type="button" @click="closeModal" class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
                <button :disabled="currentUser.role == 'user'" type="submit" class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600  disabled:bg-gray-400 disabled:cursor-not-allowed">Submit</button>
              </div>
            </form>
          </div>
        </div>
    </div>
  </template>
  
  <script setup>
      import { ref, defineProps, defineEmits,computed,watch } from 'vue';
      import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

      
      //get the current user
      const authStore = useAuthStore()
      authStore.fetchTokenFromLocalStore()
      const currentUser = authStore.state.user 
        
      const props = defineProps({
          newDepositDetails: {
              type: Array,
              required: true,
          },
          agent: {
            type: Object, 
            required: true
          }
      });


      const showModal = ref(false);
      const modalType = ref('add');

      const route = useRoute()
      const router = useRouter()
      const month = ref(null)
      const year = ref(null)
      const agentId= route.params.agent_id
      const errorDate = ref(null)

      const form = ref({
        id: null,
        agent_id: '',
        month: '',
        year: '',
        new_deposit: '',
        date: '',
        description: '',
        market_id: '',
      });


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

    const validateDateEntry = () => {
    
      const inputDate = new Date(form.value.date)

      const inputYear = inputDate.getFullYear()
      const inputMonth = months[inputDate.getMonth()]

      if(inputDate.getTime() > new Date().getTime()) {
        errorDate.value = "Cannot Set Time Deposit on the  Future Date"
        return
      }

      if (month.value == inputMonth && year.value == inputYear){
        errorDate.value = ""
      }else{
        errorDate.value = "Please Enter Date on Specific Month And Year"
      }

    }
      
    const openModal = (type, index = null) => {
        modalType.value = type;
        showModal.value = true;
      
        if (type === 'edit' && index !== null) {
          validateDateEntry()
          form.value = { ...props.newDepositDetails[index]}
        } else {
          validateDateEntry()
          form.value = {
            id: null,
            agent_id: agentId,
            month: month.value,
            year: year.value,
            new_deposit: 10000,
            date: '',
            description: '',
            market_id: props.agent.market_id
          };
        }
      };
      
      const closeModal = () => {
        showModal.value = false;
        errorDate.value = ""
      };


      // define emits here..

      const emit = defineEmits(['passNewDeposit', 'passUpdatedNewDeposit', 'passDeleteDeposit'])
      
      const submitForm = () => {

          if (errorDate.value){
            return
          }
        
          if (modalType.value === 'add') {
        
          emit('passNewDeposit', agentId, {month:month.value, year: year.value}, form.value)

          } else if (modalType.value === 'edit') {
            
          console.log('The updated  deposit form is ', form.value)
            emit('passUpdatedNewDeposit', agentId, {month:month.value, year: year.value}, form.value)

          }
          closeModal();
      };
      
      const deleteNewDeposit = (depositId,agentId) => {
          if (confirm(`Are you sure you want to delete this New Deposit?`)) {

            emit('passDeleteDeposit', agentId, {month:month.value, year:year.value}, {id:depositId} )
         }
      };

    watch(route, async (newRoute) => {
      console.log("The route is changed, reacting to the change..");
      router.push(newRoute.fullPath);
      month.value = newRoute.query.month 
      year.value = newRoute.query.year

    });

    // Watcher for the target field
    watch(
      () => form.value.date,
      (newValue) => {
        
        const inputDate = new Date(newValue)

        const inputYear = inputDate.getFullYear()
        const inputMonth = months[inputDate.getMonth()]

        if(inputDate.getTime() > new Date().getTime()) {
          errorDate.value = "Cannot Set Time Deposit on the  Future Date"
          return
        }
        
        if (month.value == inputMonth && year.value == inputYear){
          errorDate.value = ""
        }else{
          errorDate.value = "Please Enter Date on Specific Month And Year"
        }

      }
    );

  </script>
  
  <style>
  /* Add custom styles if needed */
  </style>
  