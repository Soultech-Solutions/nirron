import { ref } from 'vue'
import type { DashboardData } from '@/dashboard/types'
import {
  emptyDashboardData,
  getDashboardData,
} from '@/dashboard/dashboard.service'
import { getErrorMessage } from '@/utils'

export function useDashboard () {
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)
  const data = ref<DashboardData>(emptyDashboardData)

  async function fetchDashboard (): Promise<void> {
    loading.value = true
    errorMessage.value = null
    try {
      data.value = await getDashboardData()
    } catch (error) {
      data.value = emptyDashboardData
      errorMessage.value = getErrorMessage(
        error,
        'Falha ao carregar dados da dashboard pelo Directus',
      )
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMessage,
    data,
    fetchDashboard,
  }
}
