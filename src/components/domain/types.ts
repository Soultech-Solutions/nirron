import type { ApprovalStatusEnum, OperationStatus, RiskLevel, ValidationResultEnum, ValidationStageEnum } from '@/enums'

export interface WorkflowStep {
  stage: ValidationStageEnum
  label: string
  status: ValidationResultEnum
  progress?: number
}

export interface ValidationCardData {
  title: string
  stage: ValidationStageEnum
  status: ValidationResultEnum
  progress: number
  fieldsTotal: number
  fieldsApproved: number
  fieldsRejected: number
  aiSummary?: string
}

export interface ComparisonField {
  label: string
  sourceA: string
  sourceB: string
  result: ValidationResultEnum
  critical?: boolean
}

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: string
  color?: string
  user?: string
}

export interface RiskItem {
  level: RiskLevel
  title: string
  description: string
  field?: string
}

export interface TaxItem {
  label: string
  rate: string
  base: string
  value: string
}

export interface NCMData {
  code: string
  description: string
  historicalCode?: string
  historicalCount?: number
  riskLevel: RiskLevel
  aiOpinion?: string
}

export interface BenefitItem {
  type: string
  label: string
  applied: boolean
  valid: boolean
  expiresAt?: string
}

export interface DocumentItem {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  status: ValidationResultEnum
}

export interface AIResultData {
  summary: string
  confidence: number
  recommendation: string
  risks: string[]
  approved: boolean
}

export interface OperationSummaryField {
  label: string
  value: string
  icon?: string
}

export interface ImportCardData {
  id: string
  reference: string
  company: string
  status: OperationStatus
  ncm: string
  updatedAt: string
}

export interface CriticalAlertData {
  id: string
  title: string
  message: string
  severity: 'danger' | 'warning' | 'info'
  timestamp: string
  actionable?: boolean
}

export type ApprovalStatusType = ApprovalStatusEnum
