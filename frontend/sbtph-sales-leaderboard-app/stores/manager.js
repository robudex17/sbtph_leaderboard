import { defineStore }  from 'pinia'

import { reactive } from 'vue'
import API from '~/utils/api'

export const useManagerStore = defineStore('managers', () => {
    const state = reactive({
        managers: [],
        loading : false,
        error: null
    })

    const fetchManagers = async () => {
        state.loading = true 
        state.error = null

        try {
            const response = await fetch(API.fetchManagers)
            const data = await response.json()
            state.managers = data
          
        }catch(error) {
            state.error = error.message

        }finally {
            state.loading = false
        }
    }

    return {
        state, fetchManagers,
    }
})



