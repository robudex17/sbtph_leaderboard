<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4 mt-20">
      <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-800 text-center"> {{ feedbackTitle }} FOR <span class="uppercase text-blue-700 font-bold"> ({{ dbName }})</span></h2>
        <p class="text-gray-600 text-center mb-6"> {{ feedbackSubtitle }}</p>
        <!-- <div>
          {{   feedback.length}}
        </div> -->
        <form @submit.prevent="submitFeedback">
          <div v-for="(question, index) in questions" :key="question.id" class="mb-4 p-4 border rounded-lg bg-gray-50">
            <p class="text-gray-700 font-medium">{{ index + 1 }}. {{ question.text }}</p>

            <div class="mt-2 flex justify-between space-x-4">
              <label
                v-for="choice in question.choices"
                :key="choice.score"
                class="w-full flex flex-col items-center cursor-pointer border rounded-lg py-2 px-4 hover:bg-gray-200 transition"
                :class="responses[question.id] === choice.score ? 'bg-blue-300  border-blue-700 ' : 'border-gray-300'"
              >
                <input
                  type="radio"
                  :name="`question-${question.id}`"
                  :value="choice.score"
                  v-model="responses[question.id]"
                  class="hidden"
                />
                <span class="text-lg font-medium" :class="responses[question.id] === choice.score ? ' text-red-500' : ' text-gray-700'">{{ choice.label }}</span>
                <span class="text-xs text-gray-500"  :class="responses[question.id] === choice.score ? ' text-green-300 font-bold' : ' text-gray-700'">({{ choice.score }} pts)</span>
              </label>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-gray-700 font-medium">Feedback Score: <span class="text-purple-400 font-bold">{{ feedbackScore }}</span> </p>
            <p class="text-gray-700 font-medium">Total Score: {{ totalScore }} / {{ maxPossibleScore }}</p>
            <p class="text-gray-700 font-medium">Feedback Percentage: {{ percentage }}%</p>

            <div class="w-full bg-gray-200 h-4 rounded-lg overflow-hidden mt-2">
              <div
                class="h-full bg-blue-500 transition-all"
                :style="{ width: percentage + '%' }"
              ></div>
            </div>
          </div>

          <button
            type="submit"
            class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {{ isUpdating ? "Update Feedback" : "Submit Feedback" }}
          </button>
        </form>
      </div>
  </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, defineEmits } from "vue";

    const props = defineProps({
      questions: {
        type: Array,
        required: true,
      },
      feedbackTitle: {
        type: String,
        required: true,
      },
      feedbackSubtitle: {
        type: String,
        required: true,
      },
      feedback: {
        type: Array, 
        required: true
      },
      feedbackType: {
        type: String,
        required: true
      }
    });

      //get the current user
    const authStore = useAuthStore()
    authStore.fetchTokenFromLocalStore()
    const currentUser = authStore.state.user 
    const userId = "12345"
    const isUpdating = ref(false);
    const feedbackId = ref(null);
    const responses = ref({});

    const route = useRoute()
    const query = route.query
    const dbName = query.db_name
    const id = ref(null)

    if (props.feedback.length > 0){
      isUpdating.value = true
    } 

    // Watch for prop changes and initialize responses
    watch(
      () => props.questions,
      (newQuestions) => {
        responses.value = newQuestions.reduce((acc, question) => {
          acc[question.id] = null; // Initialize responses to null
          return acc;
        }, {});
      },
      { immediate: true }
    );

    watch(
      () => props.feedback,
      (newFeedback) => {
        if (newFeedback.length > 0 && newFeedback[0].responses) {
          responses.value = { ...newFeedback[0].responses }; // Ensure deep copy
        } else {
          responses.value = {};
        }
      },
      { immediate: true, deep: true }
    );


    // Compute total score & percentage
    const totalScore = computed(() =>
      Object.values(responses.value).reduce((acc, score) => acc + (score || 0), 0)
    );

    const maxPossibleScore = computed(() => {
      return props.questions.reduce((total, question) => {
        const maxScore = Math.max(...question.choices.map(choice => choice.score));
        return total + maxScore;
      }, 0);
    });

    const percentage = computed(() => ((totalScore.value / maxPossibleScore.value) * 100).toFixed(2));
    const feedbackScore =  computed(() => parseFloat(((totalScore.value / props.questions.length) ).toFixed(2)));


    const emit = defineEmits(['passFeedbackData'])
    // Submit or update feedback (Prevent submission if any question is unanswered)
    const submitFeedback = async () => {

      // Ensure all questions are answered by comparing lengths
      const allQuestionsAnswered = Object.keys(responses.value).length === props.questions.length;

      if (!allQuestionsAnswered) {
        alert("Please answer all questions before submitting.");
        return;
      }

      let feedbackData = {}
      
      if (props.feedbackType == 'agents'){
        feedbackData = {
          
          responses: responses.value,
          total_score: totalScore.value,
          percentage: percentage.value,
          feedback_score: feedbackScore.value,
          lm_id: currentUser.login_id,
          lm_dbname: currentUser.db_name,
          agent_dbname: dbName,
          
        }; 

      }else if (props.feedbackType == 'managers') {
        feedbackData = {
          
          responses: responses.value,
          total_score: totalScore.value,
          percentage: percentage.value,
          feedback_score: feedbackScore.value,
          agent_dbname: currentUser.db_name,
          agent_id: currentUser.login_id,
          manager_dbname: dbName,
          
          
        };
      }else if (props.feedbackType == 'lms'){
        feedbackData = {
          
          responses: responses.value,
          total_score: totalScore.value,
          percentage: percentage.value,
          feedback_score: feedbackScore.value,
          lm_dbname: dbName,
          manager_dbname: currentUser.db_name,
          manager_id: currentUser.login_id
          
        };
      }

      if (isUpdating.value){
        if (props.feedback[0].can_update == 0){
          alert('You are not allowed to update or change your response, if you want to update it please contact your manager')
          return
        }
        emit('passFeedbackData',  feedbackData, 'PUT'  )
      }else {
        emit('passFeedbackData',  feedbackData, 'POST'  )
      }
    

    };
</script>
