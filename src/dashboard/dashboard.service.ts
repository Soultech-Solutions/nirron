import {
  VALIDATION_RESULT,
  VALIDATION_STAGES,
} from '@/constants'
import type { ValidationStage } from '@/types'
import { OperationStatus } from '@/enums'
import {
  dashboardRepository,
  type DashboardProcessSnapshot,
} from './dashboard.repository'
import {
  DASHBOARD_STAGE_LABELS,
  type DashboardAlert,
  type DashboardData,
  type DashboardOperation,
  type DashboardTimelineItem,
  type MonthlyChartPoint,
  type StageStatusItem,
} from './types'

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const

const DATE_ALIASES = new Set([
  'date_created',
  'created_at',
  'created_date',
  'data_criacao',
  'received_at',
  'received_date',
  'data_recebimento',
  'email_date',
  'sent_at',
  'data_email',
])

const STAGE_COLORS: Record<ValidationStage, string> = {
  [VALIDATION_STAGES.DOCUMENTAL]: 'primary',
  [VALIDATION_STAGES.BL]: 'info',
  [VALIDATION_STAGES.CE_MERCANTE]: 'info',
  [VALIDATION_STAGES.NCM]: 'warning',
  [VALIDATION_STAGES.BENEFICIOS]: 'secondary',
  [VALIDATION_STAGES.TRIBUTACAO]: 'success',
}

function normalizeKey (value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function parseTimestamp (value: unknown): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/**
 * O schema atual de processes não expõe date_created/date_updated.
 * Procura uma data real em body_fields sem inventar timestamps.
 */
function resolveProcessTimestamp (snapshot: DashboardProcessSnapshot): string | undefined {
  const body = snapshot.process.body_fields
  if (!body || Array.isArray(body) || typeof body !== 'object') return undefined

  let result: string | undefined
  const walk = (source: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(source)) {
      if (result) return
      if (DATE_ALIASES.has(normalizeKey(key))) {
        result = parseTimestamp(value)
        if (result) return
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        walk(value as Record<string, unknown>)
      }
    }
  }
  walk(body)
  return result
}

function dashboardStatus (
  status: OperationStatus,
): DashboardOperation['status'] {
  if (status === OperationStatus.APPROVED || status === OperationStatus.COMPLETED) {
    return 'approved'
  }
  if (status === OperationStatus.BLOCKED || status === OperationStatus.CANCELLED) {
    return 'blocked'
  }
  if (status === OperationStatus.IN_CONFERENCE || status === OperationStatus.IN_REVIEW) {
    return 'in_review'
  }
  return 'pending'
}

function countStatuses (snapshots: DashboardProcessSnapshot[]) {
  return snapshots.reduce(
    (counts, snapshot) => {
      const status = dashboardStatus(snapshot.item.status)
      counts[status] += 1
      return counts
    },
    { pending: 0, in_review: 0, approved: 0, blocked: 0 },
  )
}

function buildKpis (snapshots: DashboardProcessSnapshot[]): DashboardData['kpis'] {
  const counts = countStatuses(snapshots)
  const stable = 'stable' as const

  return [
    {
      key: 'total',
      label: 'Total de Importações',
      value: snapshots.length,
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      trend: stable,
      trendValue: 'Directus',
    },
    {
      key: 'pending',
      label: 'Pendentes',
      value: counts.pending,
      icon: 'mdi-clock-outline',
      color: 'warning',
      trend: stable,
      trendValue: 'Atual',
    },
    {
      key: 'in_review',
      label: 'Em Conferência',
      value: counts.in_review,
      icon: 'mdi-file-search-outline',
      color: 'info',
      trend: stable,
      trendValue: 'Atual',
    },
    {
      key: 'approved',
      label: 'Aprovadas',
      value: counts.approved,
      icon: 'mdi-check-circle-outline',
      color: 'success',
      trend: stable,
      trendValue: 'Atual',
    },
    {
      key: 'blocked',
      label: 'Bloqueadas',
      value: counts.blocked,
      icon: 'mdi-block-helper',
      color: 'error',
      trend: stable,
      trendValue: 'Atual',
    },
  ]
}

function buildMonthlyChart (snapshots: DashboardProcessSnapshot[]): MonthlyChartPoint[] {
  const year = new Date().getFullYear()
  const months = MONTH_LABELS.map((month) => ({
    month,
    total: 0,
    approved: 0,
    blocked: 0,
  }))

  for (const snapshot of snapshots) {
    const timestamp = resolveProcessTimestamp(snapshot)
    if (!timestamp) continue
    const date = new Date(timestamp)
    if (date.getFullYear() !== year) continue

    const point = months[date.getMonth()]
    if (!point) continue
    point.total += 1

    const status = dashboardStatus(snapshot.item.status)
    if (status === 'approved') point.approved += 1
    if (status === 'blocked') point.blocked += 1
  }

  return months
}

function buildRecentOperations (
  snapshots: DashboardProcessSnapshot[],
): DashboardOperation[] {
  return snapshots.slice(0, 5).map((snapshot) => ({
    id: snapshot.item.id,
    reference: snapshot.item.diNumber
      ?? snapshot.item.duimpNumber
      ?? snapshot.item.invoiceNumber,
    client: snapshot.item.company,
    documentType: snapshot.item.duimpNumber ? 'DUIMP' : 'DI',
    status: dashboardStatus(snapshot.item.status),
    stage: snapshot.analysis.currentStage as ValidationStage,
    updatedAt: resolveProcessTimestamp(snapshot),
  }))
}

function timelineConfig (status: DashboardOperation['status']) {
  switch (status) {
    case 'approved':
      return { title: 'Conferência aprovada', icon: 'mdi-check-circle', color: 'success' }
    case 'blocked':
      return { title: 'Operação bloqueada', icon: 'mdi-alert-circle', color: 'error' }
    case 'in_review':
      return { title: 'Conferência em andamento', icon: 'mdi-file-search', color: 'info' }
    default:
      return { title: 'Operação pendente', icon: 'mdi-clock-outline', color: 'warning' }
  }
}

function buildTimeline (
  snapshots: DashboardProcessSnapshot[],
): DashboardTimelineItem[] {
  return snapshots.slice(0, 5).map((snapshot) => {
    const status = dashboardStatus(snapshot.item.status)
    const config = timelineConfig(status)
    return {
      id: `process-${snapshot.item.id}`,
      ...config,
      description: `${snapshot.item.invoiceNumber} — ${snapshot.item.company}`,
      timestamp: resolveProcessTimestamp(snapshot),
    }
  })
}

function buildAlerts (snapshots: DashboardProcessSnapshot[]): DashboardAlert[] {
  const alerts: DashboardAlert[] = []

  for (const snapshot of snapshots) {
    const timestamp = resolveProcessTimestamp(snapshot)
    snapshot.analysis.risks.forEach((risk, index) => {
      alerts.push({
        id: `${snapshot.item.id}-risk-${index}`,
        title: risk.title,
        message: `${snapshot.item.invoiceNumber}: ${risk.description}`,
        severity: risk.level === 'critical' ? 'danger' : 'warning',
        timestamp,
      })
    })
  }

  return alerts.slice(0, 8)
}

function buildStageStatus (
  snapshots: DashboardProcessSnapshot[],
): StageStatusItem[] {
  const stages = Object.values(VALIDATION_STAGES) as ValidationStage[]

  return stages.map((stage) => {
    const stageResults = snapshots
      .map((snapshot) => snapshot.analysis.summary.stages.find((item) => item.stage === stage))
      .filter((result) => result !== undefined)

    const evaluatedFields = stageResults.flatMap((result) =>
      result.fields.filter((field) => field.result !== VALIDATION_RESULT.PENDING),
    )
    const approvedFields = evaluatedFields.filter(
      (field) => field.result === VALIDATION_RESULT.APPROVED,
    )
    const operationCount = stageResults.filter((result) =>
      result.fields.some((field) => field.result !== VALIDATION_RESULT.PENDING),
    ).length

    return {
      stage,
      label: DASHBOARD_STAGE_LABELS[stage],
      count: operationCount,
      percentage: evaluatedFields.length
        ? Math.round((approvedFields.length / evaluatedFields.length) * 100)
        : 0,
      color: STAGE_COLORS[stage],
    }
  })
}

function buildProductivity (
  snapshots: DashboardProcessSnapshot[],
): DashboardData['productivity'] {
  const counts = countStatuses(snapshots)
  const finalized = counts.approved + counts.blocked
  const approvalRate = finalized
    ? Math.round((counts.approved / finalized) * 100)
    : 0
  const executedRules = snapshots.reduce(
    (total, snapshot) =>
      total
      + snapshot.analysis.summary.approvedRules
      + snapshot.analysis.summary.rejectedRules
      + snapshot.analysis.summary.warningRules,
    0,
  )
  const processedDocuments = snapshots.reduce(
    (total, snapshot) => total + (snapshot.process.documents?.length ?? 0),
    0,
  )

  return [
    {
      label: 'Documentos processados',
      value: processedDocuments,
      icon: 'mdi-file-document-multiple-outline',
      color: 'primary',
      description: 'Documentos vinculados aos processos do Directus',
    },
    {
      label: 'Taxa de aprovação',
      value: `${approvalRate}%`,
      icon: 'mdi-check-decagram',
      color: 'success',
      description: `${counts.approved} aprovadas de ${finalized} operações finalizadas`,
    },
    {
      label: 'Regras executadas',
      value: executedRules,
      icon: 'mdi-shield-check',
      color: 'info',
      description: 'Comparações com dados disponíveis no Directus',
    },
  ]
}

export async function getDashboardData (): Promise<DashboardData> {
  const snapshots = await dashboardRepository.getProcessSnapshots()

  return {
    kpis: buildKpis(snapshots),
    monthlyChart: buildMonthlyChart(snapshots),
    timeline: buildTimeline(snapshots),
    recentOperations: buildRecentOperations(snapshots),
    alerts: buildAlerts(snapshots),
    stageStatus: buildStageStatus(snapshots),
    productivity: buildProductivity(snapshots),
  }
}

export const emptyDashboardData: DashboardData = {
  kpis: buildKpis([]),
  monthlyChart: buildMonthlyChart([]),
  timeline: [],
  recentOperations: [],
  alerts: [],
  stageStatus: buildStageStatus([]),
  productivity: buildProductivity([]),
}
