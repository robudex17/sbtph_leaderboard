import { defineStore }  from 'pinia'

import { reactive } from 'vue'
import API from '~/utils/api'

export const useMarketStore = defineStore('market', () => {
    const state = reactive({
        market: [],
        loading : false,
        error: null
    })

    const fetchAgentMarket = async () => {
        state.loading = true 
        state.error = null

        try {
            const response = await fetch(API.fetchAgentMarket)
            const data = await response.json()
            state.market = data
          
        }catch(error) {
            state.error = error.message

        }finally {
            state.loading = false
        }
    }

    return {
        state, fetchAgentMarket
    }
})



