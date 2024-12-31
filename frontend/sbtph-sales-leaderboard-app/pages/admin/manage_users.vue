<template>
    <div>
        <h1>User List</h1>
        <button @click="loadUsers" :disabled="userStore.state.loading">
            {{ userStore.state.loading ? "Loading..." : "Fetch Users" }}
        </button>

        <p v-if="userStore.state.error">{{ userStore.state.error }}</p>

        <ul v-if="!userStore.state.loading && userStore.state.users.length">
            <li v-for="user in userStore.state.users" :key="user.id">
                {{ user.name }} --- {{ user.email }}
            </li>
        </ul>

        <p v-if="!userStore.state.loading && !userStore.state.users.length">
            No Users found..
        </p>
    </div>
</template>

<script setup>
  import { useUserStore } from '../../stores/users'
  import { onMounted } from 'vue'

  // Get the store instance
  const userStore = useUserStore()

  // Method to fetch users manually when the button is clicked
  const loadUsers = () => {
    userStore.fetchUsers()  // Trigger the store's fetch function
  }

  // Automatically fetch users when the component is mounted
  onMounted(() => {
    loadUsers()
  })
</script>
