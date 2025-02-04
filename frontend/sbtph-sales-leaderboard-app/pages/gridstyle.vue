<!-- components/DataGrid.vue -->
<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <!-- Grid Header -->
      <div class="font-bold text-xl text-center text-gray-700 bg-gray-200 p-4 rounded-lg shadow-md">Category</div>
      <div class="font-bold text-xl text-center text-gray-700 bg-gray-200 p-4 rounded-lg shadow-md">Subcategory</div>
      <div class="font-bold text-xl text-center text-gray-700 bg-gray-200 p-4 rounded-lg shadow-md">Description</div>
      <div class="font-bold text-xl text-center text-gray-700 bg-gray-200 p-4 rounded-lg shadow-md">Actions</div>
  
      <!-- Grid Data -->
      <div v-for="(item, index) in data" :key="index" class="bg-white p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="font-semibold text-gray-800">{{ item.category }}</div>
        <div class="text-gray-600 mt-2">{{ item.subcategory }}</div>
        <div class="text-gray-500 mt-2">{{ item.description }}</div>
        
        <!-- Action Buttons -->
        <div class="mt-4 flex space-x-3 justify-center">
          <!-- Edit Button -->
          <button 
            @click="editItem(index)"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Edit
          </button>
          
          <!-- Delete Button -->
          <button 
            @click="deleteItem(index)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Delete
          </button>
          
          <!-- Add Button (if required in this context) -->
          <button 
            @click="addItem"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: [
          { category: "Electronics", subcategory: "Mobile Phones", description: "Smartphones and Accessories" },
          { category: "Electronics", subcategory: "Laptops", description: "Portable Computing Devices" },
          { category: "Furniture", subcategory: "Chairs", description: "Office and Home Chairs" },
          { category: "Appliances", subcategory: "Refrigerators", description: "Cooling Machines" },
          { category: "Furniture", subcategory: "Sofas", description: "Comfortable Seating" }
        ]
      };
    },
    methods: {
      editItem(index) {
        alert(`Editing item at index: ${index}`);
        // Add your edit logic here (open a form, etc.)
      },
      deleteItem(index) {
        if (confirm(`Are you sure you want to delete this item?`)) {
          this.data.splice(index, 1); // Removes item from the array
          alert('Item deleted');
        }
      },
      addItem() {
        // Add your logic for adding a new item here
        this.data.push({ category: "New Category", subcategory: "New Subcategory", description: "New Description" });
        alert('New item added');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles for the grid */
  .grid {
    max-width: 1200px; /* Limit grid width */
    margin: 0 auto; /* Center the grid */
  }
  
  .grid div {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .grid div:hover {
    transform: scale(1.05); /* Slight zoom effect on hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow on hover */
  }
  </style>
  