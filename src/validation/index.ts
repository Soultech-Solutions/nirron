import { API_ENDPOINTS } from '@/constants'
import { BaseService } from '@/services'
import type { ValidationRule, ValidationSummary } from '@/types'

class ValidationService extends BaseService<ValidationSummary> {
  constructor () {
    super(API_ENDPOINTS.VALIDATION.BASE)
  }

  async getRules (): Promise<ValidationRule[]> {
    const { apiGet } = await import('@/services')
    const response = await apiGet<ValidationRule[]>(API_ENDPOINTS.VALIDATION.RULES)
    return response.data
  }

  async runValidation (operationId: string): Promise<ValidationSummary> {
    const { apiPost } = await import('@/services')
    const response = await apiPost<ValidationSummary>(
      `${API_ENDPOINTS.VALIDATION.BASE}/${operationId}/run`,
    )
    return response.data
  }
}

export const validationService = new ValidationService()

export * from './types'
export * from './constants'
