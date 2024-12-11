import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useManageSalesAgentStore = defineStore('salesAgents', () => {
    const state = reactive({
        salesAgents: [],
        loading:false,
        error: null
    })

    const fetchSalesAgents = async () => {
        state.loading = true
        state.error = null

        try {
            const url = 'http://localhost:8080/sales_agents'
            
            //Fetch sales agent info

            const response = await fetch(url)
            if (!response.ok){
                throw new Error(`Error: ${response.status} ${response.statusText}`)

            }

            const data = await response.json()
            state.salesAgents = data
            console.log(state.salesAgents)
        }
        catch(error){
            console.error('Failed to fetch sales agents info', error)
            state.error = error.message
        }
        finally{
            state.loading = false
        }
    }

    return {
        state, 
        fetchSalesAgents
    }
})

