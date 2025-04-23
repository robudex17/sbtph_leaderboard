<template>
    <div class="p-4 mt-20">
        <div class="p-4">
          <AgentBio :agents="salesAgentBio"></AgentBio>
        </div>
        <div>
         
        </div>
        <div class ="p-4 mt-5 mb-5">
          <TargetShipok :targetShipokDetails="salesAgentTargetShipok" 
          :agent="salesAgentBio[0]"
          :fullyear="fullyear"
           @passNewTarget="addNewTarget"
           @passUpdatedTarget="editTarget"
            @passDeleteTarget="deleteTarget" ></TargetShipok>
        </div>
        <div class ="p-4 mt-5 mb-5">
          <NewDeposit :newDepositDetails="salesAgentNewDeposit" 
          :agent="salesAgentBio[0]"
          @passNewDeposit="addNewDeposit" @passUpdatedNewDeposit="updateNewDeposit" 
          @passDeleteDeposit="deleteNewDeposit"
          
          ></NewDeposit>
        </div>

        <div class ="p-4 mt-5 mb-5" v-if="isAdmin">
          <Feedback :feedbackDetails="salesAgentFeedback"
          @passFeedback="addFeedback"
          @passUpdateFeedback="updateFeedback"
          @passDeleteFeedback="deleteFeedback"
          ></Feedback>
        </div>

       <div  class ="p-4 mt-5 mb-5">
          <agent-feedback-summary-component
          :agents="salesAgentBio"
           :averageAgentFeedback = "averageAgentFeedback" 
           :averageManagerFeedback = "averageManagerFeedback"
           :averageLmsFeedback="averageLmsFeedback"
           :averageFeedbackByQa="averageFeedbackByQa"
           :overallAverageFeedback="overallAverageFeedback"
           :feedbackData="feedbackData"
           v-if="salesAgentBio.length > 0"
          >
          
          </agent-feedback-summary-component>
       </div>
        <div class ="p-4 mt-5 mb-5">
            <Absence attendanceType="absence" attendanceTitle="Sales Agent Absences" 
            :attendanceDetails="salesAgentAbsences"  @passAttendance="addAttendanceType" @passUpdateAttendance="updateAttendanceType"
             @passDeleteAttendance="deleteAttendanceType"
             />
        </div>
        <div  class =" p-4 mt-5 mb-5">
            <Tardiness attendanceType="tardiness" attendanceTitle="Sales Agent Tardiness" 
             :attendanceDetails="salesAgentTardiness"  @passAttendance="addAttendanceType"
               @passUpdateAttendance="updateAttendanceType"
               @passDeleteAttendance="deleteAttendanceType" 
            />
        </div>
        <div  class ="p-4 mt-5 mb-5">
            <Memo attendanceType="memo" attendanceTitle="Sales Agent Memo" 
             :attendanceDetails="salesAgentMemo " 
              @passAttendance="addAttendanceType" @passUpdateAttendance="updateAttendanceType"
              @passDeleteAttendance="deleteAttendanceType" 
              />
        </div>
       
    
    </div>
  </template>
  
  <script setup>

  definePageMeta({
    middleware: 'auth'
  })

  import { onMounted, watch, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import Absence from '../../../components/AttendanceComponent.vue'
  import Tardiness from '../../../components/AttendanceComponent.vue'
  import Memo from '../../../components/AttendanceComponent.vue'
  import TargetShipok from '../../../components/TargetShipokComponent.vue'
  import Feedback from '../../../components/FeedbackComponent.vue'
  import NewDeposit from '../../../components/NewDepositComponent.vue'
  import AgentBio from '../../../components/AgentBioComponent.vue'

 
  const props = defineProps({
      fullyear: {
        type: Boolean, 
        required: true
      }

    });

  
  const router = useRouter();
  const route = useRoute();
  const query = route.query;
  // const agentId = route.params.agent_id;

 
  const month = ref(null)
  const year = ref(null)

  // Months for the dropdown
  const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
         ];


    month.value= route.query.month
    year.value = route.query.year 

    if (month.value == null || month.value == ""){
        month.value= months[new Date().getMonth()]
     }

    if (year.value == null || year.value == ""){
        year.value = new Date().getFullYear()
    }
   
  
    const today = new Date()
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  
  //get the current user
  const authStore = useAuthStore()
  authStore.fetchTokenFromLocalStore()
  const isAdmin = ref(false)

  const currentUser = authStore.state.user 

  const agentType = query.agent_type 
  const agentRole = query.agent_role


  if (currentUser.login_type == 'standarduser' && currentUser.role == 'admin'){
    isAdmin.value = true
    
  }

  

 
  let agentId;

  agentId = route.params.agent_id
 
  if(!agentId){
    if (query.agent_id) {
      if (currentUser.login_type == 'standarduser' && currentUser.role == 'admin'){
        agentId = query.agent_id
        
      }
    }else {
      agentId = currentUser.login_id
      query.agent_id = agentId
    }
  }



  const useManageSalesStore = useManageSalesAgentStore();

  const addNewTarget = async(agentId, query, target) => {
    try {
      await useManageSalesStore.addAgentTarget(agentId, query, target)
    }catch(error){
      console.log(error.errors)
    }
   
    
  }

  const deleteTarget= async(agentId, query, target_date) => {
 
    try {
      await useManageSalesStore.deleteAgentTarget(agentId, query, target_date)
    }catch(error){
      console.log(error.errors)
    }
   
    
  }

  const editTarget = async(agentId, query, target) => {
   
    try {
      await useManageSalesStore.updateAgentTarget(agentId, query, target)
    }catch(error){
      console.log(error.errors)
    }
   
    
  }

  const addNewDeposit = async (agentId, query, newDeposit) => {
    try {
      await useManageSalesStore.addAgentDeposit(agentId, query, newDeposit)
    }catch(error){
      console.log(error.errors)
    }
  }


  const updateNewDeposit = async(agentId, query,  updateNewDeposit) => {
   
   try {
     await useManageSalesStore.updateAgentDeposit(agentId, query,  updateNewDeposit)
   }catch(error){
     console.log(error.errors)
   }
  
   
 }

 const  deleteNewDeposit= async(agentId, query, newDeposit) => {
 
 try {
   await useManageSalesStore.deleteAgentNewDeposit(agentId, query, newDeposit)
 }catch(error){
   console.log(error.errors)
 }

 
}

const addAttendanceType = async (agentId, query,  attendanceType,attendance) => {
    try {
      await useManageSalesStore.addAgentAttendanceType(agentId, query, attendanceType, attendance)
      
    }catch(error){
      console.log(error.errors)
    }

    
  }

const  updateAttendanceType = async(agentId, query,  attendanceType,attendance) => {
   
   try {
     await useManageSalesStore.updateAgentAttendanceType(agentId, query, attendanceType, attendance)
   }catch(error){
     console.log(error.errors)
   }
  
   
 }


 const  deleteAttendanceType = async(agentId, query,  attendanceType,attendance) => {
 
 try {
   await useManageSalesStore.deleteAgentAttendanceType(agentId, query,  attendanceType, attendance)
 }catch(error){
   console.log(error.errors)
 }

 
}


const addFeedback = async(agentId, query, feedback) => {
    try {
      await useManageSalesStore.addAgentFeedback(agentId, query, feedback)
    }catch(error){
      console.log(error.errors)
    }
   
    
  }

 const deleteFeedback= async(agentId, query, feedback_date) => {
 
 try {
   await useManageSalesStore.deleteAgentFeedback(agentId, query, feedback_date)
 }catch(error){
   console.log(error.errors)
 }

 
}

const updateFeedback = async(agentId, query, feedback) => {

 try {
   await useManageSalesStore.updateAgentFeedback(agentId, query, feedback)
 }catch(error){
   console.log(error.errors)
 }

 
}

  
  const salesAgentBio = computed(() => useManageSalesStore.state.salesAgentBio);
  const salesAgentTargetShipok = computed(() => useManageSalesStore.state.salesAgentTargetShipok);
  const salesAgentNewDeposit = computed(() => useManageSalesStore.state.salesAgentNewDeposit);
  const salesAgentAbsences = computed(() => useManageSalesStore.state.salesAgentAbsences);
  const salesAgentMemo = computed(() => useManageSalesStore.state.salesAgentMemo);
  const salesAgentTardiness = computed(() => useManageSalesStore.state.salesAgentTardiness);

  const salesAgentFeedback = computed(() => useManageSalesStore.state.salesAgentFeedback);


       //use feedback state management
  const useFeedbackStore  = feedbackStore()
       // Reset the feedback data
  useFeedbackStore.state.agents = [];
  useFeedbackStore.state.managers = [];
  useFeedbackStore.state.lms = [];
  useFeedbackStore.state.qa = [];

  const agentFeedback = computed(() => useFeedbackStore.state.agents);
  const managerFeedback = computed(() => useFeedbackStore.state.managers);
  const lmsFeedback = computed(() => useFeedbackStore.state.lms);

  const feedbackByQa =  computed(() => useFeedbackStore.state.qa);

  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const feedbackData = computed(() => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-based index

  const results = [];

  const processMonth = (month, index) => {
    // Skip future months in current year
    if (parseInt(year.value) === currentYear && index > currentMonthIndex) return;

    // Filter feedbacks by month and year
    const filterByMonthYear = (data) => {
    
      return data.filter(item => 
        
        item.month === month && item.year === parseInt(year.value)
      );
    };

    const agentData = filterByMonthYear(agentFeedback.value || []);
    const managerData = filterByMonthYear(managerFeedback.value || []);
    const lmsData = filterByMonthYear(lmsFeedback.value || []);
    const qaData = filterByMonthYear(feedbackByQa.value || []);
    
   
    const calculateAverage = (data) => {
      if (!Array.isArray(data) || data.length === 0) return null;
      const total = data.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
      return (total / data.length).toFixed(2);
    };

    const avgAgent = calculateAverage(agentData);
    const avgManager = calculateAverage(managerData);
    const avgLms = calculateAverage(lmsData);
    const avgQa = calculateAverage(qaData);

    const overall = (() => {
      const scores = [avgAgent, avgManager, avgLms, avgQa]
        .filter(score => score !== null)
        .map(parseFloat);
      if (scores.length === 0) return null;
      return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    })();

    results.push({
      month,
      year: year.value,
      averageAgentFeedback: avgAgent,
      averageManagerFeedback: avgManager,
      averageLmsFeedback: avgLms,
      averageFeedbackByQa: avgQa,
      overallAverageFeedback: overall
    });
  };

  if (props.fullyear) {
    monthNames.forEach((month, index) => {
      processMonth(month, index);
    });
  } else {
    const selectedIndex = monthNames.findIndex(m => m === month.value);
   
    if (selectedIndex !== -1) {
      processMonth(month.value, selectedIndex);
    }
  }

  return results;
});


  const averageAgentFeedback = computed(() => {
  if (!Array.isArray(agentFeedback.value) || agentFeedback.value.length === 0) return null;
  const total = agentFeedback.value.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
  return (total / agentFeedback.value.length).toFixed(2);
});

const averageManagerFeedback = computed(() => {
  if (!Array.isArray(managerFeedback.value) || managerFeedback.value.length === 0) return null;
  const total = managerFeedback.value.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
  return (total / managerFeedback.value.length).toFixed(2);
});

const averageLmsFeedback = computed(() => {
  if (!Array.isArray(lmsFeedback.value) || lmsFeedback.value.length === 0) return null;
  const total = lmsFeedback.value.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
  return (total / lmsFeedback.value.length).toFixed(2);
});

const averageFeedbackByQa  = computed(() => {
  if (!Array.isArray(feedbackByQa.value) || feedbackByQa.value.length === 0) return null;
  const total = feedbackByQa.value.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
  return (total / feedbackByQa.value.length).toFixed(2);
});



// Compute the overall average, excluding empty feedback categories
const overallAverageFeedback = computed(() => {
  const scores = [];

  if (averageAgentFeedback.value !== null) scores.push(parseFloat(averageAgentFeedback.value));
  if (averageManagerFeedback.value !== null) scores.push(parseFloat(averageManagerFeedback.value));
  if (averageLmsFeedback.value !== null) scores.push(parseFloat(averageLmsFeedback.value));
  if (averageFeedbackByQa.value !== null) scores.push(parseFloat(averageFeedbackByQa.value));
 
  if (scores.length === 0) return null; // Return null if there's no valid data

  return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2);
});

//QA Feedback
const addQaFeedback = async(id, feedbackResponse, feedbackType, query, httpMethod) => {
    try {
        await useFeedbackStore.addUpdateDeleteFeedback(id, feedbackResponse, feedbackType, query, httpMethod)
    }catch(error){
      console.log(error)
    }
}

const updateQaFeedback = async(id, feedbackResponse, feedbackType, query, httpMethod) => {
    try {
        await useFeedbackStore.addUpdateDeleteFeedback(id, feedbackResponse, feedbackType, query, httpMethod)
    }catch(error){
      console.log(error)
    }
}

const deleteQaFeedback = async(id, feedbackResponse, feedbackType, query, httpMethod) => {
    try {
        await useFeedbackStore.addUpdateDeleteFeedback(id, feedbackResponse, feedbackType, query, httpMethod)
    }catch(error){
      console.log(error)
    }
    
}


  onMounted(async()=> {
         // Reset the feedback data
    useFeedbackStore.state.agents = [];
    useFeedbackStore.state.managers = [];
    useFeedbackStore.state.lms = [];
    useManageSalesStore.state.salesAgentTargetShipok = []
    useManageSalesStore.state.salesAgentNewDeposit = []
    useManageSalesStore.state.salesAgentAbsences = []
    useManageSalesStore.state.salesAgentMemo = []
    useManageSalesStore.state.salesAgentTardiness = []
    useManageSalesStore.state.salesAgentFeedback = []

    if (agentType == 0){
        await useFeedbackStore.fetchFeedback(agentId, {month:month.value, year: year.value, fullyear: props.fullyear}, 'agents')
      }else if(agentType == 1 ){
        await useFeedbackStore.fetchFeedback(agentId, {month:month.value, year: year.value, fullyear: props.fullyear}, 'managers')
        await useFeedbackStore.fetchFeedback(agentId, {month:month.value, year: year.value, fullyear: props.fullyear}, 'lms')
     
      }else if (agentType == 2){

        await useFeedbackStore.fetchFeedback(agentId, {month:month.value, year: year.value, fullyear: props.fullyear}, 'managers')
      }

      await  useFeedbackStore.fetchFeedback(agentId, {month:month.value, year: year.value, fullyear: props.fullyear}, 'qa')
      await  useManageSalesStore.fetchSalesAgent(agentId)

      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTargetShipok')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentNewDeposit')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentAbsences')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentMemo')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTardiness')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentFeedback')

    })


  watch(route, async (newRoute) => {

     // Reset the feedback data
  useFeedbackStore.state.agents = [];
  useFeedbackStore.state.managers = [];
  useFeedbackStore.state.lms = [];
  useManageSalesStore.state.salesAgentTargetShipok = []
  useManageSalesStore.state.salesAgentNewDeposit = []
  useManageSalesStore.state.salesAgentAbsences = []
  useManageSalesStore.state.salesAgentMemo = []
  useManageSalesStore.state.salesAgentTardiness = []
  useManageSalesStore.state.salesAgentFeedback = []


  const newAgentId = newRoute.params.agent_id;
  await useManageSalesStore.fetchSalesAgent(newAgentId);

  if (agentType == 0 ) {
    await useFeedbackStore.fetchFeedback(newAgentId, newRoute.query, 'agents');
  } else if (agentType == 1 ) {
    await useFeedbackStore.fetchFeedback(newAgentId,  newRoute.query, 'managers');
    await useFeedbackStore.fetchFeedback(newAgentId,  newRoute.query, 'lms');
  } else if (agentType == 2) {
    await useFeedbackStore.fetchFeedback(newAgentId,  newRoute.query, 'managers');
  }
  await  useFeedbackStore.fetchFeedback(agentId,  newRoute.query, 'qa')
  router.push(newRoute.fullPath);
  await  useManageSalesStore.fetchSalesAgent(agentId)
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentTargetShipok')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentNewDeposit')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentAbsences')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentMemo')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentTardiness')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentFeedback')
});


  </script>



  