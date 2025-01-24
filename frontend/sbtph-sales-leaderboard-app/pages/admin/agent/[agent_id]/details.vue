<template>
    <div class="p-4 mt-20">
        <p> Agent ID is: {{ agentId }}</p>
        <p> SalesAgent Info: {{ salesAgentBio}}</p>
        <p>salesAgentTargetShipok: {{ salesAgentTargetShipok }}</p>
        <p> salesAgentNewDeposit: {{ salesAgentNewDeposit }}</p>
        <p>salesAgentAbsences: {{ salesAgentAbsences }}</p>
        <p>salesAgentMemo: {{ salesAgentMemo  }}</p>
        <p>salesTardiness: {{ salesTardiness }}</p>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    

    const router = useRouter();
    const route = useRoute();
    const query = route.query;
    console.log(query)
    const agentId = route.params.agent_id
    const useManageSalesStore = useManageSalesAgentStore()



    const salesAgentBio = computed(() => useManageSalesStore.state.salesAgentBio)
    const salesAgentTargetShipok = computed(() => useManageSalesStore.state.salesAgentTargetShipok)
    const salesAgentNewDeposit = computed(() => useManageSalesStore.state.salesAgentNewDeposit)
    const salesAgentAbsences = computed(() => useManageSalesStore.state.salesAgentAbsences)
    const salesAgentMemo = computed(() => useManageSalesStore.state.salesAgentMemo)
    const salesTardiness = computed(() => useManageSalesStore.state.salesAgentTardiness)
    
    
    onMounted(()=> {
        useManageSalesStore.fetchSalesAgent(agentId)
        useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTargetShipok')
        useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentNewDeposit')
        useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentAbsences')
        useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentMemo')
        useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTardiness')
    })

</script>