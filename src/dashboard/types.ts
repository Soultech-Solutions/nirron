import type { MetricTrend } from '@/components/ui/types'
import type { ID, Timestamp } from '@/types'
import type { ValidationStage } from '@/types'
import { VALIDATION_STAGES } from '@/constants'

export interface DashboardSummary {
  totalOperations: number
  authorizedOperations: number
  blockedOperations: number
  pendingOperations: number
  validationRulesApplied: number
  lastUpdatedAt: Timestamp
}

export interface DashboardMetric {
  id: ID
  label: string
  value: number
  trend?: MetricTrend
  unit?: string
}

export interface DashboardKpi {
  key: string
  label: string
  value: number
  icon: string
  color: string
  trend: MetricTrend
  trendValue: string
}

export interface MonthlyChartPoint {
  month: string
  total: number
  approved: number
  blocked: number
}

export interface DashboardTimelineItem {
  id: string
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export interface DashboardOperation {
  id: string
  reference: string
  client: string
  documentType: 'DI' | 'DUIMP'
  status: 'pending' | 'in_review' | 'approved' | 'blocked'
  stage: ValidationStage
  updatedAt: string
}

export interface DashboardAlert {
  id: string
  title: string
  message: string
  severity: 'danger' | 'warning' | 'info'
  timestamp: string
}

export interface StageStatusItem {
  stage: ValidationStage
  label: string
  count: number
  percentage: number
  color: string
}

export interface DashboardData {
  kpis: DashboardKpi[]
  monthlyChart: MonthlyChartPoint[]
  timeline: DashboardTimelineItem[]
  recentOperations: DashboardOperation[]
  alerts: DashboardAlert[]
  stageStatus: StageStatusItem[]
  productivity: { label: string; value: string | number; icon: string; color: string; description: string }[]
}

export const DASHBOARD_STAGE_LABELS: Record<ValidationStage, string> = {
  [VALIDATION_STAGES.DOCUMENTAL]: 'Documental',
  [VALIDATION_STAGES.BL]: 'BL',
  [VALIDATION_STAGES.CE_MERCANTE]: 'CE Mercante',
  [VALIDATION_STAGES.NCM]: 'NCM',
  [VALIDATION_STAGES.BENEFICIOS]: 'Benefícios',
  [VALIDATION_STAGES.TRIBUTACAO]: 'Tributação',
}
