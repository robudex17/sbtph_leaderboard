import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  authStore.fetchTokenFromLocalStore()
  
  if (!authStore.state.user || authStore.state.user?.role !== 'admin' ) {
    return navigateTo('/unauthorized'); // Redirect if not admin
  }
});
