import { API_ENDPOINTS } from '@/constants'
import { apiGet } from '@/services'
import type { DashboardMetric, DashboardSummary } from './types'

class DashboardService {
  async getSummary (): Promise<DashboardSummary> {
    const response = await apiGet<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY)
    return response.data
  }

  async getMetrics (): Promise<DashboardMetric[]> {
    const response = await apiGet<DashboardMetric[]>(API_ENDPOINTS.DASHBOARD.METRICS)
    return response.data
  }
}

export const dashboardService = new DashboardService()

export { useDashboard } from './composables/useDashboard'
export { dashboardMockData } from './mock'
export * from './types'
