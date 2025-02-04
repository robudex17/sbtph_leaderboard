const HTTPADDR = `http://localhost:8080`

const API = {
    salesAgents: `${HTTPADDR}/sales_agents`,
    fetchSaleAgentTargetShipok: `${HTTPADDR}/agent_target_shipok`,
    fetchSaleAgentNewDeposit:  `${HTTPADDR}/agent_deposit`,
    fetchSalesAgentAbsences:  `${HTTPADDR}/agent_absent`,
    fetchSalesAgentMemo: `${HTTPADDR}/agent_memo`,
    fetchSalesAgentTardiness: `${HTTPADDR}/agent_tardiness`,
    fetchSalesAgentFeedback: `${HTTPADDR}/agent_feedback`,
    fetchAgentMarket:  `${HTTPADDR}/agent_market`,
    fetchManagers: `${HTTPADDR}/managers`,
    

    agentTargetShipok:  `${HTTPADDR}/agent_target_shipok`,
    agentDeposit: `${HTTPADDR}/agent_deposit`,
    agentAttendance: {
        absence: `${HTTPADDR}/agent_absent`,
        tardiness: `${HTTPADDR}/agent_tardiness`,
        memo: `${HTTPADDR}/agent_memo`,
    },

    agentFeedback: `${HTTPADDR}/agent_feedback`,

   
}

export default API 

