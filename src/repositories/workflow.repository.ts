import { API_ENDPOINTS } from '@/constants'
import type { WorkflowDetailDto } from '@/dtos'
import { apiGet } from '@/services/api/http.client'
import { BaseRepository } from './base.repository'

class WorkflowRepository extends BaseRepository<WorkflowDetailDto> {
  constructor () {
    super(API_ENDPOINTS.WORKFLOW.BASE)
  }

  async getByOperationId (operationId: string): Promise<WorkflowDetailDto> {
    const response = await apiGet<WorkflowDetailDto>(
      `${this.basePath}/${operationId}`,
    )
    return response.data
  }
}

export const workflowRepository = new WorkflowRepository()
