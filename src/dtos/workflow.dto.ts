import type { ValidationStageEnum, ValidationResultEnum, RiskLevel } from '@/enums'

export interface WorkflowStageDto {
  stage: ValidationStageEnum
  label: string
  status: ValidationResultEnum
  progress: number
  completedAt?: string
}

export interface WorkflowChecklistItemDto {
  id: string
  label: string
  checked: boolean
  critical: boolean
}

export interface WorkflowFieldDto {
  field: string
  label: string
  invoiceValue: string
  diValue: string
  result: ValidationResultEnum
  blockageLevel?: number
}

export interface WorkflowStageDetailDto extends WorkflowStageDto {
  checklist: WorkflowChecklistItemDto[]
  fields: WorkflowFieldDto[]
  aiSummary?: string
  comments: string[]
  risks: { level: RiskLevel; message: string }[]
  documentsCount: number
}

export interface WorkflowDetailDto {
  operationId: string
  stages: WorkflowStageDetailDto[]
  currentStage: ValidationStageEnum
  overallProgress: number
}
