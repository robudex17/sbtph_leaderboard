<template>
    <div class="p-4 mt-20">
        <div class="p-4">
          <AgentBio :agents="salesAgentBio"></AgentBio>
        </div>
       
        <div class ="p-4 mt-5 mb-5">
          <TargetShipok :targetShipokDetails="salesAgentTargetShipok" :agent="salesAgentBio[0]" @passNewTarget="addNewTarget" @passUpdatedTarget="editTarget" @passDeleteTarget="deleteTarget" ></TargetShipok>
        </div>
        <div class ="p-4 mt-5 mb-5">
          <NewDeposit :newDepositDetails="salesAgentNewDeposit" @passNewDeposit="addNewDeposit" @passUpdatedNewDeposit="updateNewDeposit" @passDeleteDeposit="deleteNewDeposit"></NewDeposit>
        </div>
        <div class ="p-4 mt-5 mb-5">
          <Feedback :feedbackDetails="salesAgentFeedback"
          @passFeedback="addFeedback"
          @passUpdateFeedback="updateFeedback"
          @passDeleteFeedback="deleteFeedback"
          ></Feedback>
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

 
  
  const router = useRouter();
  const route = useRoute();
  const query = route.query;
  // const agentId = route.params.agent_id;


  
  //get the current user
  const authStore = useAuthStore()
  authStore.fetchTokenFromLocalStore()

  const currentUser = authStore.state.user 


  let agentId;

  agentId = route.params.agent_id

  if(!agentId){
    agentId = currentUser.login_id
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


  onMounted(async()=> {
      await  useManageSalesStore.fetchSalesAgent(agentId)
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTargetShipok')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentNewDeposit')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentAbsences')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentMemo')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentTardiness')
      await   useManageSalesStore.fetchSalesAgentDetails(agentId,query, 'salesAgentFeedback')
    })


  
  watch(route, async (newRoute) => {
  
  router.push(newRoute.fullPath);
  await  useManageSalesStore.fetchSalesAgent(agentId)
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentTargetShipok')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentNewDeposit')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentAbsences')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentMemo')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentTardiness')
  await   useManageSalesStore.fetchSalesAgentDetails(agentId,newRoute.query, 'salesAgentFeedback')
});


import { defineStore } from 'pinia'
import { reactive } from 'vue'

import API from '~/utils/api'

export const feedbackStore = defineStore('feedback', () => {
      //call auth store fetch the token on the localstorage 
    //save it to state.token
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()

    const  token = authStore.state.token 

    // Reactive state definition
    const state = reactive({
        agents: [],
        lms: [],
        managers: [],
        
        loading:false,
        error: null
    })

    // Action to fetch sales leaderboard
    const fetchFeedback = async (id, queryString, feedbackType) => {
        let errorMessage ;
        let url;
      
        switch(feedbackType){
           
            case "agents" :
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.agent
               break 
            case "lms":
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.lm
                break
            case "managers":
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.manager
                break                
       
            
                
            default:
                console.log('Invalid Feedback  Type')
                throw new Error(`Invalid Feedback Type: ${feedbackType}`)
        }
        
         url = new URL(`${url}/${id}`)
        if (queryString) {
            Object.keys(queryString).forEach((key) =>
                url.searchParams.append(key, queryString[key])
            )
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
            });

            //token is  invalid  remove to local storage 
            if(!response.ok && response.status == 403){
                const errors = await response.json()
                if (errors.message == 'Invalid Access Token'){
                    localStorage.removeItem('jwt')
                    alert('Your Session has been expired, Please Login again.')
                    location.reload()
                }
            }            

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            state[feedbackType] = data;

        } catch (error) {
            const customError = new Error(`${errorMessage}: ${error.message}`);
            customError.originalError = error;  // Attach the original error
            throw customError;
        }
    }

    const addUpdateDeleteFeedback = async (id, feedbackResponse, feedbackType, query, method) => {
        state.loading = true
        state.error = null

        switch(feedbackType){
        
            case "agents":
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.agent
                break 
            case "lms":
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.lm
                break
            case "managers":
                errorMessage = `Failed to fetch  ${feedbackType} feedback`
                url = API.feedback.manager
                break                
       
            
                
            default:
                console.log('Invalid Feedback  Type')
                throw new Error(`Invalid Feedback Type: ${feedbackType}`)
        }
        
         url = new URL(`${url}/${id}`)      
        try {
            const response = await fetch(`${url}`, {
                method: method,
                body: JSON.stringify(feedbackResponse),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
            }) 
         
            //token is  invalid  remove to local storage 
            if(!response.ok && response.status == 403){
                const errors = await response.json()
                if (errors.message == 'Invalid Access Token'){
                    localStorage.removeItem('jwt')
                    alert('Your Session has been expired, Please Login again.')
                    location.reload()
                }
            }           

            if (!response.ok) {
                
                const errors = await response.json()
                throw new Error(errors || "An unknown error occurred");
            }
  
           
           await fetchFeedback(id, query, feedbackType)
           if (method == 'POST'){
                alert(`Adding New ${feedbackType} feedback with id of ${id} is successful` ) 
           }else if (method == 'PUT'){
                alert(`${feedbackType} feedback with id of ${id} is updated` ) 
           }else if (method == 'DELETE'){
                alert(`${feedbackType} feedback with id of ${id} is deleted` ) 
           }
          
        } catch (error) {
            console.log(error.message)
            state.error = error.message
        } finally {
            state.loading = false
        }
    }

 

    // Expose individual state properties and actions
    return {
        state,  
        fetchFeedback ,
        addUpdateDeleteFeedback,
    }
})




  </script>
  