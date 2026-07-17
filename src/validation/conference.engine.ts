import type { ComparisonField, ValidationCardData, WorkflowStep } from '@/components/domain/types'
import {
  BLOCKAGE_LEVELS,
  VALIDATION_RESULT,
  VALIDATION_STAGE_LABELS,
  VALIDATION_STAGES,
} from '@/constants'
import { PLANNED_RULES_COUNT, STAGE_FIELD_RULES, STAGE_ORDER, type StageFieldRule } from '@/constants/validation-fields.constants'
import { ApprovalStatusEnum, OperationStatus, RiskLevel, ValidationResultEnum, ValidationStageEnum } from '@/enums'
import type {
  BlockageLevel,
  ValidationFieldResult,
  ValidationResult,
  ValidationStage,
  ValidationStageResult,
  ValidationSummary,
} from '@/types'

type FieldBag = Record<string, string>

export interface ConferenceDocumentInput {
  id: string | number
  doc_type?: string | null
  extracted_fields?: Record<string, unknown> | null
  markdown_excerpt?: string | null
  extraction_status?: string | null
  extraction_error?: string | null
  confidence?: number | null
}

export interface ConferenceProcessInput {
  id: string | number
  ref_nirron?: string | null
  ref_cliente?: string | null
  template_name?: string | null
  body_fields?: Record<string, unknown> | unknown[] | null
  confidence?: number | null
  documents?: ConferenceDocumentInput[] | null
}

export interface ConferenceAnalysis {
  summary: ValidationSummary
  workflowSteps: WorkflowStep[]
  validationCards: ValidationCardData[]
  comparisonFields: ComparisonField[]
  operationStatus: OperationStatus
  registrationStatus: ApprovalStatusEnum
  currentStage: ValidationStageEnum
  risks: Array<{ level: RiskLevel, title: string, description: string, field?: string }>
  aiResult: {
    summary: string
    confidence: number
    recommendation: string
    risks: string[]
    approved: boolean
  }
}

const DOC_TYPE_ALIASES: Record<string, string[]> = {
  invoice: ['invoice', 'nf', 'nota_fiscal', 'commercial_invoice', 'draft_document'],
  di: ['di', 'declaracao_importacao'],
  duimp: ['duimp'],
  bl: ['bl', 'bill_of_lading', 'conhecimento'],
  ce_mercante: ['ce_mercante', 'ce', 'mercante'],
}

function normalizeKey (value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function stringifyValue (value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(stringifyValue).filter(Boolean).join(', ')
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['value', 'nome', 'name', 'codigo', 'code', 'text']) {
      if (record[key] != null) return stringifyValue(record[key])
    }
  }
  return String(value)
}

function flattenFields (source: Record<string, unknown> | null | undefined): FieldBag {
  if (!source) return {}
  const out: FieldBag = {}

  const walk = (obj: Record<string, unknown>, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key
      const normalized = normalizeKey(key)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        walk(value as Record<string, unknown>, path)
      } else {
        const text = stringifyValue(value)
        if (!text) continue
        out[normalized] = text
        out[normalizeKey(path)] = text
      }
    }
  }

  walk(source)
  return out
}

function pickField (bag: FieldBag, aliases: string[]): string {
  for (const alias of aliases) {
    const key = normalizeKey(alias)
    if (bag[key]) return bag[key]
  }
  return ''
}

function normalizeComparable (value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w./-]+/g, '')
    .trim()
}

function valuesMatch (a: string, b: string): boolean {
  if (!a || !b) return false
  const left = normalizeComparable(a)
  const right = normalizeComparable(b)
  if (left === right) return true

  const numLeft = Number(left.replace(',', '.'))
  const numRight = Number(right.replace(',', '.'))
  if (!Number.isNaN(numLeft) && !Number.isNaN(numRight)) {
    return Math.abs(numLeft - numRight) < 0.01
  }
  return false
}

function resolveDocType (docType: string | null | undefined): string {
  const raw = normalizeKey(docType ?? '')
  for (const [canonical, aliases] of Object.entries(DOC_TYPE_ALIASES)) {
    if (aliases.some((alias) => raw.includes(normalizeKey(alias)))) {
      return canonical
    }
  }
  return raw || 'unknown'
}

function buildSourceBags (process: ConferenceProcessInput): Record<string, FieldBag> {
  const bags: Record<string, FieldBag> = {
    body: flattenFields(
      process.body_fields && !Array.isArray(process.body_fields)
        ? process.body_fields as Record<string, unknown>
        : {},
    ),
    invoice: {},
    di: {},
    duimp: {},
    bl: {},
    ce_mercante: {},
  }

  for (const doc of process.documents ?? []) {
    const type = resolveDocType(doc.doc_type)
    const fields = flattenFields(doc.extracted_fields ?? undefined)
    if (!bags[type]) bags[type] = {}
    bags[type] = { ...bags[type], ...fields }

    // draft/nf frequentemente equivale a invoice comercial
    if (type === 'invoice' || type === 'nf' || type === 'draft_document') {
      bags.invoice = { ...bags.invoice, ...fields }
    }
    if (type === 'duimp') {
      bags.di = { ...bags.di, ...fields }
    }
  }

  return bags
}

function bagHasData (bag: FieldBag | undefined): boolean {
  return Boolean(bag && Object.keys(bag).length > 0)
}

function compareRule (
  rule: StageFieldRule,
  bags: Record<string, FieldBag>,
): ValidationFieldResult {
  const bagA = bags[rule.sourceA] ?? {}
  const bagB = bags[rule.sourceB] ?? {}
  const sourceA = pickField(bagA, rule.aliases)
  const sourceB = pickField(bagB, rule.aliases)
  const hasSourceA = bagHasData(bagA)
  const hasSourceB = bagHasData(bagB)

  let result: ValidationResult = VALIDATION_RESULT.PENDING
  let message: string | undefined

  // Sem os dois lados do cruzamento (ex.: só Invoice, sem DI) → aguarda extração
  if (!hasSourceA || !hasSourceB) {
    result = VALIDATION_RESULT.PENDING
    message = !hasSourceA && !hasSourceB
      ? 'Documentos de origem ainda não disponíveis'
      : `Aguardando documento/fonte: ${!hasSourceA ? rule.sourceA : rule.sourceB}`
  } else if (!sourceA && !sourceB) {
    result = VALIDATION_RESULT.PENDING
    message = 'Campo não encontrado nos documentos extraídos'
  } else if (!sourceA || !sourceB) {
    result = rule.blockageLevel === BLOCKAGE_LEVELS.LEVEL_1
      ? VALIDATION_RESULT.REJECTED
      : VALIDATION_RESULT.WARNING
    message = `Campo ausente em ${!sourceA ? rule.sourceA : rule.sourceB}`
  } else if (valuesMatch(sourceA, sourceB)) {
    result = VALIDATION_RESULT.APPROVED
  } else if (rule.blockageLevel === BLOCKAGE_LEVELS.LEVEL_1) {
    result = VALIDATION_RESULT.REJECTED
    message = 'Divergência Nível 1 — bloqueio total'
  } else {
    result = VALIDATION_RESULT.WARNING
    message = 'Divergência Nível 2 — exige aprovação de supervisor'
  }

  return {
    field: rule.field,
    label: rule.label,
    expected: sourceA || '—',
    actual: sourceB || '—',
    result,
    blockageLevel: rule.blockageLevel,
    message,
  }
}

function stageStatus (fields: ValidationFieldResult[]): ValidationResult {
  if (fields.some((f) => f.result === VALIDATION_RESULT.REJECTED)) return VALIDATION_RESULT.REJECTED
  if (fields.some((f) => f.result === VALIDATION_RESULT.WARNING)) return VALIDATION_RESULT.WARNING
  if (fields.length > 0 && fields.every((f) => f.result === VALIDATION_RESULT.APPROVED)) return VALIDATION_RESULT.APPROVED
  if (fields.some((f) => f.result === VALIDATION_RESULT.APPROVED)) return VALIDATION_RESULT.WARNING
  return VALIDATION_RESULT.PENDING
}

function toEnumResult (result: ValidationResult): ValidationResultEnum {
  switch (result) {
    case VALIDATION_RESULT.APPROVED:
      return ValidationResultEnum.APPROVED
    case VALIDATION_RESULT.REJECTED:
      return ValidationResultEnum.REJECTED
    case VALIDATION_RESULT.WARNING:
      return ValidationResultEnum.WARNING
    default:
      return ValidationResultEnum.PENDING
  }
}

function toStageEnum (stage: ValidationStage): ValidationStageEnum {
  return stage as ValidationStageEnum
}

function registrationFromStages (stages: ValidationStageResult[]): {
  operationStatus: OperationStatus
  registrationStatus: ApprovalStatusEnum
} {
  const hasLevel1 = stages.some((s) =>
    s.fields.some((f) => f.result === VALIDATION_RESULT.REJECTED && f.blockageLevel === BLOCKAGE_LEVELS.LEVEL_1),
  )
  const hasLevel2 = stages.some((s) =>
    s.fields.some((f) => f.result === VALIDATION_RESULT.WARNING || (f.result === VALIDATION_RESULT.REJECTED && f.blockageLevel === BLOCKAGE_LEVELS.LEVEL_2)),
  )
  const allApproved = stages.every((s) => s.status === VALIDATION_RESULT.APPROVED)
  const anyPending = stages.some((s) => s.status === VALIDATION_RESULT.PENDING)

  if (hasLevel1) {
    // PDF: divergência Nível 1 → registro não autorizado
    return { operationStatus: OperationStatus.BLOCKED, registrationStatus: ApprovalStatusEnum.NOT_AUTHORIZED }
  }
  if (hasLevel2) {
    return { operationStatus: OperationStatus.IN_REVIEW, registrationStatus: ApprovalStatusEnum.PENDING }
  }
  if (allApproved) {
    return { operationStatus: OperationStatus.APPROVED, registrationStatus: ApprovalStatusEnum.AUTHORIZED }
  }
  if (anyPending) {
    return { operationStatus: OperationStatus.IN_CONFERENCE, registrationStatus: ApprovalStatusEnum.PENDING }
  }
  return { operationStatus: OperationStatus.PENDING, registrationStatus: ApprovalStatusEnum.PENDING }
}

/**
 * Executa a conferência NIRRON (PDF): cruza campos por etapa com níveis de bloqueio.
 */
export function runConferenceAnalysis (process: ConferenceProcessInput): ConferenceAnalysis {
  const bags = buildSourceBags(process)
  const stages: ValidationStageResult[] = STAGE_ORDER.map((stage) => {
    const fields = STAGE_FIELD_RULES[stage].map((rule) => compareRule(rule, bags))
    return {
      stage,
      status: stageStatus(fields),
      fields,
    }
  })

  const { operationStatus, registrationStatus } = registrationFromStages(stages)

  const workflowSteps: WorkflowStep[] = stages.map((stage) => ({
    stage: toStageEnum(stage.stage),
    label: stage.stage === VALIDATION_STAGES.DOCUMENTAL
      ? 'Invoice x DI'
      : stage.stage === VALIDATION_STAGES.BL
        ? 'BL'
        : stage.stage === VALIDATION_STAGES.CE_MERCANTE
          ? 'CE Mercante'
          : stage.stage === VALIDATION_STAGES.NCM
            ? 'NCM'
            : stage.stage === VALIDATION_STAGES.BENEFICIOS
              ? 'Benefícios'
              : 'Tributação',
    status: toEnumResult(stage.status),
    progress: stage.status === VALIDATION_RESULT.PENDING
      ? Math.round((stage.fields.filter((f) => f.result !== VALIDATION_RESULT.PENDING).length / Math.max(stage.fields.length, 1)) * 100)
      : 100,
  }))

  const validationCards: ValidationCardData[] = stages.map((stage) => {
    const approved = stage.fields.filter((f) => f.result === VALIDATION_RESULT.APPROVED).length
    const rejected = stage.fields.filter((f) => f.result === VALIDATION_RESULT.REJECTED).length
    const warnings = stage.fields.filter((f) => f.result === VALIDATION_RESULT.WARNING).length
    const critical = stage.fields.find((f) => f.result === VALIDATION_RESULT.REJECTED || f.result === VALIDATION_RESULT.WARNING)

    return {
      title: VALIDATION_STAGE_LABELS[stage.stage],
      stage: toStageEnum(stage.stage),
      status: toEnumResult(stage.status),
      progress: Math.round((approved / Math.max(stage.fields.length, 1)) * 100),
      fieldsTotal: stage.fields.length,
      fieldsApproved: approved,
      fieldsRejected: rejected,
      aiSummary: critical?.message
        ? `${critical.label}: ${critical.message}`
        : warnings
          ? `${warnings} divergência(s) Nível 2`
          : rejected
            ? `${rejected} divergência(s) Nível 1`
            : undefined,
    }
  })

  const comparisonFields: ComparisonField[] = stages
    .flatMap((stage) => stage.fields)
    .filter((field) => field.result !== VALIDATION_RESULT.PENDING || field.expected !== '—' || field.actual !== '—')
    .slice(0, 24)
    .map((field) => ({
      label: field.label,
      sourceA: field.expected,
      sourceB: field.actual,
      result: toEnumResult(field.result),
      critical: field.blockageLevel === BLOCKAGE_LEVELS.LEVEL_1 && field.result === VALIDATION_RESULT.REJECTED,
    }))

  const risks = stages.flatMap((stage) =>
    stage.fields
      .filter((f) => f.result === VALIDATION_RESULT.REJECTED || f.result === VALIDATION_RESULT.WARNING)
      .map((f) => ({
        level: f.blockageLevel === BLOCKAGE_LEVELS.LEVEL_1 ? RiskLevel.CRITICAL : RiskLevel.HIGH,
        title: `${VALIDATION_STAGE_LABELS[stage.stage]} — ${f.label}`,
        description: f.message ?? `Divergência: ${f.expected || '—'} ≠ ${f.actual || '—'}`,
        field: f.field,
      })),
  )

  const approvedRules = stages.reduce((acc, s) => acc + s.fields.filter((f) => f.result === VALIDATION_RESULT.APPROVED).length, 0)
  const rejectedRules = stages.reduce((acc, s) => acc + s.fields.filter((f) => f.result === VALIDATION_RESULT.REJECTED).length, 0)
  const warningRules = stages.reduce((acc, s) => acc + s.fields.filter((f) => f.result === VALIDATION_RESULT.WARNING).length, 0)
  const totalRules = stages.reduce((acc, s) => acc + s.fields.length, 0)

  const summary: ValidationSummary = {
    operationId: String(process.id),
    registrationStatus: registrationStatus === ApprovalStatusEnum.AUTHORIZED
      ? 'authorized'
      : registrationStatus === ApprovalStatusEnum.NOT_AUTHORIZED
        ? 'not_authorized'
        : 'pending',
    stages,
    totalRules,
    approvedRules,
    rejectedRules,
    warningRules,
  }

  const currentStage = toStageEnum(
    stages.find((s) => s.status !== VALIDATION_RESULT.APPROVED)?.stage
      ?? VALIDATION_STAGES.TRIBUTACAO,
  )

  const confidence = totalRules
    ? Math.round((approvedRules / totalRules) * 100)
    : 0

  const aiResult = registrationStatus === ApprovalStatusEnum.AUTHORIZED
    ? {
        summary: `Conferência concluída para ${process.ref_nirron ?? process.id}. ${approvedRules}/${totalRules} regras aprovadas.`,
        confidence,
        recommendation: 'REGISTRO AUTORIZADO — Todas as validações críticas aprovadas.',
        risks: [] as string[],
        approved: true,
      }
    : registrationStatus === ApprovalStatusEnum.NOT_AUTHORIZED
      ? {
          summary: `Divergências Nível 1 detectadas em ${process.ref_nirron ?? process.id}.`,
          confidence,
          recommendation: 'REGISTRO NÃO AUTORIZADO — Corrija os campos críticos antes do prosseguimento.',
          risks: risks.filter((r) => r.level === RiskLevel.CRITICAL).map((r) => r.title),
          approved: false,
        }
      : {
          summary: `Conferência em andamento para ${process.ref_nirron ?? process.id}.`,
          confidence,
          recommendation: warningRules
            ? 'Há divergências Nível 2 — requer aprovação de supervisor.'
            : 'Aguardando preenchimento/extração dos campos restantes.',
          risks: risks.slice(0, 5).map((r) => r.title),
          approved: false,
        }

  return {
    summary,
    workflowSteps,
    validationCards,
    comparisonFields,
    operationStatus,
    registrationStatus,
    currentStage,
    risks,
    aiResult,
  }
}

export function getPlannedRulesCount (): number {
  return PLANNED_RULES_COUNT
}

export type { BlockageLevel }
