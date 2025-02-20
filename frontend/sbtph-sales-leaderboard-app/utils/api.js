// const HTTPADDR = `http://localhost:8080`

const HTTPADDR = `http://192.168.70.252:8080/api`
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

    standardUsers:  `${HTTPADDR}/standardusers`,
    
    fethSalesLearderboard : `${HTTPADDR}/sales_leaderboard`,
    fetchAgentPerformance: `${HTTPADDR}/agent_performance`,
    fetchDashboard: `${HTTPADDR}/sales_dashboard`,

    fetchAnalytics:  `${HTTPADDR}/analytics`,

    agentTargetShipok:  `${HTTPADDR}/agent_target_shipok`,
    agentDeposit: `${HTTPADDR}/agent_deposit`,

    agentAttendance: {
        absence: `${HTTPADDR}/agent_absent`,
        tardiness: `${HTTPADDR}/agent_tardiness`,
        memo: `${HTTPADDR}/agent_memo`,
    },

    agentFeedback: `${HTTPADDR}/agent_feedback`,

    sales_login: `${HTTPADDR}/sales_login`,
    sales_logout: `${HTTPADDR}/sales_logout`,
    sales_register: `${HTTPADDR}/sales_register`,
    sales_update_login :  `${HTTPADDR}/sales_update_login`,    
    refreshToken: `${HTTPADDR}/refresh_token`,

    standardusers_login: `${HTTPADDR}/standardusers_login`,
    standardusers_logout: `${HTTPADDR}/standardusers_logout`,
    standardusers_update_login :  `${HTTPADDR}/standardusers_update_login`,    
    standardusers_register: `${HTTPADDR}/standardusers_register`,

    fetch_market_target_shipok: `${HTTPADDR}/agent_market_target_shipok`,
    fetch_market_new_deposit: `${HTTPADDR}/agent_market_new_deposit`,
}

export default API 

