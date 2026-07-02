import { API_ENDPOINTS } from '@/constants'
import { BaseService } from '@/services'
import type { WorkflowOperation } from './types'

class WorkflowService extends BaseService<WorkflowOperation> {
  constructor () {
    super(API_ENDPOINTS.WORKFLOW.BASE)
  }
}

export const workflowService = new WorkflowService()

export * from './types'
export * from './constants'
