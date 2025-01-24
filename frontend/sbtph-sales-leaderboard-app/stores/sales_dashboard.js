import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useDashBoardStore = defineStore('dashboard', () => {
    // Reactive state definition
    const state = reactive({
        dashboard: {},
        loading: false,
        error: null,
    })

    // Action to fetch sales leaderboard
    const fetchDashboard = async (queryString = null) => {
        state.loading = true
        state.error = null

        try {
            // Build the URL
            let url = new URL('http://localhost:8080/sales_dashboard')
            if (queryString) {
                Object.keys(queryString).forEach((key) =>
                    url.searchParams.append(key, queryString[key])
                )
            }

            // Fetch leaderboard data
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            state.dashboard = data
           
        } catch (error) {
            console.error('Failed to fetch dashboard:', error)
            state.error = error.message
        } finally {
            state.loading = false
        }
    }



    // Expose individual state properties and actions
    return {
        state,  
        fetchDashboard ,
    }
})
