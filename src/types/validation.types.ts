import type {
  BLOCKAGE_LEVELS,
  REGISTRATION_STATUS,
  VALIDATION_RESULT,
  VALIDATION_STAGES,
} from '@/constants'

export type ValidationStage =
  (typeof VALIDATION_STAGES)[keyof typeof VALIDATION_STAGES]

export type BlockageLevel =
  (typeof BLOCKAGE_LEVELS)[keyof typeof BLOCKAGE_LEVELS]

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS]

export type ValidationResult =
  (typeof VALIDATION_RESULT)[keyof typeof VALIDATION_RESULT]

export interface ValidationRule {
  id: string
  code: string
  name: string
  description: string
  stage: ValidationStage
  blockageLevel: BlockageLevel
  active: boolean
}

export interface ValidationFieldResult {
  field: string
  label: string
  expected: string
  actual: string
  result: ValidationResult
  blockageLevel: BlockageLevel
  message?: string
}

export interface ValidationStageResult {
  stage: ValidationStage
  status: ValidationResult
  fields: ValidationFieldResult[]
  completedAt?: string
}

export interface ValidationSummary {
  operationId: string
  registrationStatus: RegistrationStatus
  stages: ValidationStageResult[]
  totalRules: number
  approvedRules: number
  rejectedRules: number
  warningRules: number
}
