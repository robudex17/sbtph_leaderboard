import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  authStore.fetchTokenFromLocalStore()
  console.log(authStore.state.user?.role)
  if (!authStore.state.user || (authStore.state.user?.role !== 'manager' && authStore.state.user?.role !== 'admin') ) {

    return navigateTo('/unauthorized'); // Redirect if not admin
  }else{
    console.log('The role is not a useer?')
  }
});
