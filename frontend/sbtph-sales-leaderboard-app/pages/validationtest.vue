<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <button 
        @click="openModal" 
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Open Form
      </button>
  
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <form @submit.prevent="validateForm">
            <!-- Target Input -->
            <div class="mb-4">
              <label 
                for="targetInput" 
                class="block text-lg font-medium text-gray-700"
              >
                Target:
              </label>
              <input
                id="targetInput"
                type="text"
                v-model="target"
                @input="validateTarget"
                class="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errorTarget" class="text-red-500 text-sm mt-2">{{ errorTarget }}</p>
            </div>
  
            <!-- Ship OK Input -->
            <div class="mb-4">
              <label 
                for="shipOkInput" 
                class="block text-lg font-medium text-gray-700"
              >
                Ship OK:
              </label>
              <input
                id="shipOkInput"
                type="text"
                v-model="ship_ok"
                @input="validateShipOk"
                class="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errorShipOk" class="text-red-500 text-sm mt-2">{{ errorShipOk }}</p>
            </div>
  
            <!-- Buttons -->
            <div class="mt-4 flex justify-between">
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300"
                :disabled="errorTarget || errorShipOk"
              >
                Submit
              </button>
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: false,
        target: "",
        ship_ok: "",
        errorTarget: "",
        errorShipOk: "",
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
        // Reset inputs and errors when opening the modal
        this.target = "";
        this.ship_ok = "";
        this.errorTarget = "";
        this.errorShipOk = "";
      },
      closeModal() {
        this.showModal = false;
        this.target = "";
        this.ship_ok = "";
        this.errorTarget = "";
        this.errorShipOk = "";
      },
      // Validate Target input on every keystroke
      validateTarget() {
        if (this.target === "" || !/^\d+$/.test(this.target)) {
          this.errorTarget = "Please enter a valid whole number.";
        } else {
          this.errorTarget = "";
        }
      },
      // Validate Ship OK input on every keystroke
      validateShipOk() {
        if (this.ship_ok === "" || !/^\d+$/.test(this.ship_ok)) {
          this.errorShipOk = "Please enter a valid whole number.";
        } else {
          this.errorShipOk = "";
        }
      },
      validateForm() {
        // Perform one last validation check before submission
        this.validateTarget();
        this.validateShipOk();
  
        if (this.errorTarget || this.errorShipOk) {
          return; // Do not submit if errors exist
        }
        
        // If valid, proceed with submission
        alert("Form submitted successfully!");
        this.closeModal();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Additional custom styles can go here if needed */
  </style>
  