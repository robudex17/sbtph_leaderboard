import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
    // Reactive state definition
    const state = reactive({
        analyticsData: [],
        loading: false,
        error: null,
    })

    // Action to fetch sales leaderboard
    const fetchAnalyticsData = async (queryString = null, scope) => {
        state.loading = true
        state.error = null

        console.log('the scope is ', scope)
        try {
            // Build the URL
            let url = new URL(`http://localhost:8080/analytics/${scope}`)
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
            console.log('the data is ',data)
            state.analyticsData = data
           
        } catch (error) {
            console.error('Failed to fetch anlytics data:', error)
            state.error = error.message
        } finally {
            state.loading = false
        }
    }



    // Expose individual state properties and actions
    return {
        state,  
        fetchAnalyticsData ,
    }
})
