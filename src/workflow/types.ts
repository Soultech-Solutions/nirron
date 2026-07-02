import type { ID, Timestamp } from '@/types'
import type { RegistrationStatus, ValidationStage } from '@/types'

export interface WorkflowOperation {
  id: ID
  reference: string
  clientName: string
  documentType: 'DI' | 'DUIMP'
  currentStage: ValidationStage
  registrationStatus: RegistrationStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface WorkflowStageProgress {
  stage: ValidationStage
  completed: boolean
  completedAt?: Timestamp
}
