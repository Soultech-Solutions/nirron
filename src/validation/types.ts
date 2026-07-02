import type { ValidationRule, ValidationStageResult } from '@/types'

export interface ValidationExecution {
  operationId: string
  stages: ValidationStageResult[]
  startedAt: string
  completedAt?: string
}

export interface ValidationRuleGroup {
  stage: ValidationRule['stage']
  rules: ValidationRule[]
}
