import { ref } from 'vue'
import { dashboardMockData } from '@/dashboard/mock'
import type { DashboardData } from '@/dashboard/types'

export function useDashboard () {
  const loading = ref(false)
  const data = ref<DashboardData>(dashboardMockData)

  async function fetchDashboard (): Promise<void> {
    loading.value = true
    try {
      // Substituir por chamada API: await dashboardService.getSummary()
      await new Promise((resolve) => setTimeout(resolve, 300))
      data.value = dashboardMockData
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    data,
    fetchDashboard,
  }
}
