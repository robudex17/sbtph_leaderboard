<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
    <!-- Apply transition when login is successful -->
    <transition name="fade">
      <div v-if="loginSuccess" class="login-success-message">
        <p>Login Successful!</p>
      </div>
    </transition>

    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="~/assets/img/sbtlogo.png" alt="Logo" class="w-32 h-auto" />
      </div>

      <!-- Form Start -->
      <h2 class="text-3xl font-semibold text-center text-gray-900 mb-6">Login</h2>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <!-- Role Dropdown -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Login As</label>
          <select
            v-model="loginType"
            id="role"
            class="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standuser">Standard User</option>
            <option value="salesagent">Sales Agent</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
        >
          Login
        </button>
      </form>
      <!-- Form End -->

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600 font-bold">
          SBT PHILIPPINES SALES APP
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'



const router = useRouter()
const authStore = useAuthStore() 

definePageMeta({
  layout: 'custom' ,// This tells Nuxt to use the 'custom' layout for this page
  middleware: ['auth'] 
})

// Define reactive form data
const username = ref('')
const password = ref('')
const loginType = ref('standuser') // Default role selection
const loginSuccess = ref(false)


const login = async () => {
  if (username.value === "" || password.value === "") {
    alert('Username and Password should not be empty')
    return
  }

  // Send role along with login
  await authStore.login(username.value, password.value, loginType.value)
  
  if (authStore.state.user?.role == 'user' && authStore.state.token){
    alert('Login is Successful for user')
    router.push('/agent_performance/month')
    return
  }
  if (authStore.state.error) {
    alert(authStore.state.error)
    return
  }

  loginSuccess.value = true
  authStore.fetchTokenFromLocalStore()

  if (authStore.state.token) {
    alert("Login is Successful")
    router.push('/')
    return
  }
}

onMounted(() => {
  if (authStore.state.token) {
    authStore.fetchTokenFromLocalStore()
    if (authStore.state.token) {
      router.push('/')
    }
  }
})
</script>

<style scoped>
.login-success-message {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 10s ease-in-out, transform 10s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
