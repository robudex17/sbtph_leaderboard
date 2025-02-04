<template>
    <div class ="p-4 mt-20" >
       
        <div class="p-4">
          <AgentBio></AgentBio>
        </div>
       
        <div class ="p-4 mt-5 mb-5">
          <TargetShipok :targetShipokDetails="agentTargetShipok"></TargetShipok>
        </div>
        <div class ="p-4 mt-5 mb-5">
          <NewDeposit :newDepositDetails="agentNewDeposit"></NewDeposit>
        </div>
        <div class ="p-4 mt-5 mb-5">
          <Feedback :feedbackDetails="agentFeedback"></Feedback>
        </div>
        <div class ="p-4 mt-5 mb-5">
            <Absence attendanceType="Absence" attendanceTitle="Sales Agent Absences" :attendanceDetails="salesAgentAbsences"/>
        </div>
        <div  class =" p-4 mt-5 mb-5">
            <Tardiness attendanceType="Tardiness" attendanceTitle="Sales Agent Tardiness"  :attendanceDetails="agentTardines" />
        </div>
        <div  class ="p-4 mt-5 mb-5">
            <Memo attendanceType="Memo" attendanceTitle="Sales Agent Memo"  :attendanceDetails="agentMemos"/>
        </div>
      
    </div>
    
</template>

<script setup>
    import { ref, } from 'vue'
    import Absence from '../components/AttendanceComponent.vue'
    import Tardiness from '../components/AttendanceComponent.vue'
    import Memo from '../components/AttendanceComponent.vue'
    import TargetShipok from '../components/TargetShipokComponent.vue'
    import Feedback from '../components/FeedbackComponent.vue'
    import NewDeposit from '../components/NewDepositComponent.vue'
    import AgentBio from '../components/AgentBioComponent.vue'


    const agent = ref({
    id: 2472,
    manager_id: 2394,
    agent_type: 1,
    firstname: "Brian",
    lastname: "Cruz",
    db_name: "Bry",
    image_link: null,
    status: "active",
    market_id: 5
});
    
    const agentNewDeposit = ref([{ "id": 377, "agent_id": 2870, "month": "March", "year": 2024, "new_deposit": "10000.00", "description": "New Deposit For New Customer", "date": "2024-03-01", "created_at": "2024-12-30T12:36:47.000Z", "updated_at": "2024-12-30T12:36:47.000Z" }, { "id": 378, "agent_id": 2870, "month": "March", "year": 2024, "new_deposit": "10000.00", "description": "New Deposit For New Customer", "date": "2024-03-16", "created_at": "2024-12-30T12:36:47.000Z", "updated_at": "2024-12-30T12:36:47.000Z" }])

    const agentFeedback = ref([ { "agent_id": 2394, "month": "January", "year": 2024, "date": "2024-01-24", "feedback": "4.9550", "created_at": "2024-12-31T03:53:41.000Z", "updated_at": "2024-12-31T03:53:41.000Z" }])
    const salesAgentAbsences = ref([
    {
      id: 72,
      agent_id: 2870,
      month: "September",
      year: "2024",
      date: "2024-09-28",
      description: "First absent",
      created_at: "2024-12-28T07:36:42.000Z",
      updated_at: "2024-12-28T07:36:42.000Z",
    },
    {
      id: 72,
      agent_id: 2870,
      month: "September",
      year: "2024",
      date: "2024-09-28",
      description: "Second absent",
      created_at: "2024-12-28T07:36:42.000Z",
      updated_at: "2024-12-28T07:36:42.000Z",
    },
    {
      id: 72,
      agent_id: 2870,
      month: "September",
      year: "2024",
      date: "2024-09-28",
      description: "Third absent",
      created_at: "2024-12-28T07:36:42.000Z",
      updated_at: "2024-12-28T07:36:42.000Z",
    },
  ]);

  const agentMemos = ref([ { "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "First Memo", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },

{ "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "Second Memo", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },

{ "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "Third Memo", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },
 ]
)

const agentTardines = ref([ { "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "First Tardiness", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },
{ "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "Second Tardiness", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },

{ "id": 72, "agent_id": 2870, "month": "September", "year": "2024", "date": "2024-09-28", "description": "Third Tardines", "created_at": "2024-12-28T07:36:42.000Z", "updated_at": "2024-12-28T07:36:42.000Z" },
 ]
)

const agentTargetShipok = ref([ { "agent_id": 2394, "month": "May", "year": 2023, "date": "2023-05-01", "target": 398, "ship_ok": 255, "market_id": 0, "created_at": "2024-12-26T15:15:00.000Z", "updated_at": "2024-12-26T15:15:00.000Z" }])
  

</script>

<style scoped>
.agent-table-container {
  padding: 16px;
  margin: 16px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.agent-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;
}

.agent-table th, .agent-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.agent-table th {
  background-color: #f4f4f4;
  color: #333;
  font-size: 1.1em;
}

.agent-table td {
  color: #666;
  font-size: 1em;
}

.agent-table .photo-cell {
  text-align: center;
}

.agent-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.agent-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.agent-photo span {
  font-style: italic;
  color: #777;
  font-size: 0.9em;
}

.status {
  font-weight: bold;
}

.status.active {
  color: #4caf50;
}

.status.inactive {
  color: #f44336;
}
</style>