import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { AUTH_ROUTE_PATHS } from '@/constants/auth.constants'
import { useAuthStore } from '@/stores'

export function useAuth () {
  const authStore = useAuthStore()
  const router = useRouter()
  const { user, loading, isAuthenticated } = storeToRefs(authStore)

  const isAdmin = computed(() => authStore.hasRole('admin'))
  const isSupervisor = computed(() => authStore.hasRole('supervisor', 'admin'))
  const isAnalyst = computed(() => authStore.hasRole('analyst', 'supervisor', 'admin'))

  async function logout (): Promise<void> {
    await authStore.logout()
    await router.push(AUTH_ROUTE_PATHS.LOGIN)
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isSupervisor,
    isAnalyst,
    login: authStore.login,
    logout,
    fetchMe: authStore.fetchMe,
    hasRole: authStore.hasRole,
  }
}
