import { API_ENDPOINTS } from '@/constants'
import { apiPost } from '@/services'
import { BaseService } from '@/services'
import type { ReportFilter, ValidationReport } from './types'

class ReportsService extends BaseService<ValidationReport> {
  constructor () {
    super(API_ENDPOINTS.REPORTS.BASE)
  }

  async generate (filter: ReportFilter): Promise<ValidationReport> {
    const response = await apiPost<ValidationReport>(API_ENDPOINTS.REPORTS.BASE, filter)
    return response.data
  }
}

export const reportsService = new ReportsService()

export * from './types'
export * from './constants'
