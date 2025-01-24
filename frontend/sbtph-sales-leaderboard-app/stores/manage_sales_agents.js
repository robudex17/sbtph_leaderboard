import { defineStore } from 'pinia'
import { reactive } from 'vue'

import API from '~/utils/api'

export const useManageSalesAgentStore = defineStore('salesAgents', () => {
    const state = reactive({
        salesAgents: [],
        salesAgentBio: [],
        salesAgentTargetShipok: [],
        salesAgentNewDeposit: [],
        salesAgentAbsences: [],
        salesAgentMemo: [],
        salesAgentTardiness: [],
        loading:false,
        error: null
    })

    const fetchSalesAgents = async () => {
        state.loading = true;
        state.error = null;
        let url = API.fetchSalesAgents
        try {
            // Fetch sales agent info
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            state.salesAgents = data;
        } catch (error) {
            const customError = new Error(`Failed to fetch sales agents info: ${error.message}`);
            customError.originalError = error;  // Attach the original error
            throw customError;
        }
    };

    const fetchSalesAgent = async (agentId) => {
        state.loading = true;
        state.error = null;
        let url = API.fetchSalesAgents
        try {
            // Fetch sales agent info
            const response = await fetch(`${url}/${agentId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            state.salesAgentBio = data;
        } catch (error) {
            const customError = new Error(`Failed to fetch sales agents info: ${error.message}`);
            customError.originalError = error;  // Attach the original error
            throw customError;
        }
    };


    const fetchSalesAgentDetails = async (agentId, queryString, detailsType) => {
        let errorMessage ;
        let url;
      
        switch(detailsType){
            // case "salesAgentBio":
            //     errorMessage = `Failed to fetch sales agent bio with the id of ${agentId}`
            //     url = API.fetchSalesAgentBio
            //     break
            case "salesAgentTargetShipok":
                errorMessage = `Failed to fetch sales agent target/shipok with the id of ${agentId}`
                url = API.fetchSaleAgentTargetShipok
                break 
            case "salesAgentNewDeposit":
                errorMessage = `Failed to fetch sales agent new deposit with the id of ${agentId}`
                url = API.fetchSaleAgentNewDeposit
                break
            case "salesAgentAbsences":
                errorMessage = `Failed to fetch sales agent absences with the id of ${agentId}`
                url = API.fetchSalesAgentAbsences
                break                
           case "salesAgentMemo":
                errorMessage = `Failed to fetch sales agent memo's with the id of ${agentId}`
                 url = API.fetchSalesAgentMemo
                break
           case "salesAgentTardiness":
                errorMessage = `Failed to fetch sales agent tardiness with the id of ${agentId}`
                url = API.fetchSalesAgentTardiness
                break
                
            default:
                console.log('Invalid Agent Details Type')
                throw new Error(`Invalid Agent Details Type: ${detailsType}`)
        }
         url = new URL(`${url}/${agentId}`)
        if (queryString) {
            Object.keys(queryString).forEach((key) =>
                url.searchParams.append(key, queryString[key])
            )
        }
        console.log('url is',url)
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            state[detailsType] = data;

        } catch (error) {
            const customError = new Error(`${errorMessage}: ${error.message}`);
            customError.originalError = error;  // Attach the original error
            throw customError;
        }
    }

  
    return {
        state, 
        fetchSalesAgents,
        fetchSalesAgent,
        fetchSalesAgentDetails
    }
})

