import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useLeaderBoardStore = defineStore('leaderboard', () => {
    // Reactive state definition
    const state = reactive({
        leaderboard: [],
        agentPerformance: [],
        loading: false,
        error: null,
    })

    // Action to fetch sales leaderboard
    const fetchLeaderboard = async (queryString = null) => {
        state.loading = true
        state.error = null

        try {
            // Build the URL
            let url = new URL('http://localhost:8080/sales_leaderboard')
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
            state.leaderboard = data
            console.log(state.leaderboard)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
            state.error = error.message
        } finally {
            state.loading = false
        }
    }

    const fetchAgentPerformance = async(agent_id, queryString) => {
        state.loading = false
        state.error = null 

        try {
            let url = new URL(`http://localhost:8080/agent_performance/${agent_id}`)
            if(queryString){
                Object.keys(queryString).forEach(key => {
                    url.searchParams.append(key, queryString[key])
                })
            }

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            }
            const data = await response.json()
            state.agentPerformance = data
            console.log(state.agentPerformance)
        
        }

        catch (error){
            console.error('Failed to fetch Agent Performance Details', error)
            state.error = error.message
        }
        finally {
            state.loading = false
        }
    }

    // Expose individual state properties and actions
    return {
        state,  
        fetchLeaderboard,
    }
})
