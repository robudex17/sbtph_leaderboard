export function useUsers() {
  const users = ref([])

  const loading  = ref(true)

  const fetchUsers = async () => {

    loading.value = true 

    const { data, error} = await useFetch('https://jsonplaceholder.typicode.com/users')
    alert('I am using this composable!') 

    if(!error.value) {
        users.value = data.value 
    }
    loading.value = false
  }

  onMounted(fetchUsers)

  return {
    users,
    loading,
    fetchUsers
  }
}