<template>
    <div>
      <button
        @click="exportExcel"
        class="flex items-center justify-center gap-2 w-full py-3 px-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
      >
        <FontAwesomeIcon :icon="['fas', 'file-excel']" class="text-xl" />
        Export to Excel
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
  exportUrl: {
    type: String,
    required: true
  },
  exportFileName: {
    type: String, 
    required: true
  },
  query: {
    type: Object, 
    required: true
  },
  token: {
    type:String , 
    required: true
  }
});

let url = new URL(props.exportUrl)
         console.log(url)
        if (props.query) {
            Object.keys(props.query).forEach((key) =>
                url.searchParams.append(key, props.query[key])
            )
        }

const exportExcel = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.token}`,
                },
      });
  
      if (!response.ok) throw new Error('Failed to fetch the Excel file');
  
      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = props.exportFileName;
      downloadLink.click();
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      alert('There was an error exporting the file.');
    }
  };
  </script>
  