import type {
  AIResultData,
  ComparisonField,
  DocumentItem,
  RiskItem,
  TimelineEvent,
  ValidationCardData,
  WorkflowStep,
} from '@/components/domain/types'
import { ApprovalStatusEnum, OperationStatus, RiskLevel, ValidationResultEnum, ValidationStageEnum } from '@/enums'

interface ProcessLike {
  id: string | number
  ref_nirron?: string | null
  ref_cliente?: string | null
  template_name?: string | null
  body_fields?: Record<string, unknown> | unknown[] | null
  confidence?: number | null
}

interface DocumentLike {
  id: string | number
  doc_type?: string | null
  markdown_excerpt?: string | null
  confidence?: number | null
  extraction_status?: string | null
  extraction_error?: string | null
}

/** Normaliza confidence do Directus (0–1 ou 0–100). */
export function normalizeConfidence (value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value)) return null
  if (value > 1) return Math.min(value / 100, 1)
  if (value < 0) return 0
  return value
}

function docResultStatus (statusRaw: string | null | undefined): ValidationResultEnum {
  const value = (statusRaw ?? '').toLowerCase()
  if (value.includes('error') || value.includes('fail') || value.includes('reject')) {
    return ValidationResultEnum.REJECTED
  }
  if (value.includes('warn')) {
    return ValidationResultEnum.WARNING
  }
  if (value.includes('done') || value.includes('success') || value.includes('ok') || value.includes('approved') || value.includes('complete')) {
    return ValidationResultEnum.APPROVED
  }
  if (!value) return ValidationResultEnum.PENDING
  return ValidationResultEnum.PENDING
}

/**
 * Status da operação a partir de confidence + documentos.
 * Confidence sozinho não basta: documentos rejeitados forçam bloqueio.
 */
export function resolveOperationStatus (
  confidence: number | null | undefined,
  documents: Array<Pick<DocumentLike, 'extraction_status' | 'extraction_error'>> = [],
): OperationStatus {
  const normalized = normalizeConfidence(confidence)
  const results = documents.map((doc) => docResultStatus(doc.extraction_status))

  if (results.some((r) => r === ValidationResultEnum.REJECTED) || documents.some((d) => Boolean(d.extraction_error))) {
    return OperationStatus.BLOCKED
  }
  if (results.some((r) => r === ValidationResultEnum.WARNING)) {
    return OperationStatus.IN_REVIEW
  }
  if (results.length > 0 && results.every((r) => r === ValidationResultEnum.APPROVED)) {
    if (normalized != null && normalized < 0.7) return OperationStatus.IN_CONFERENCE
    return OperationStatus.APPROVED
  }
  if (results.some((r) => r === ValidationResultEnum.APPROVED || r === ValidationResultEnum.PENDING)) {
    return OperationStatus.IN_CONFERENCE
  }

  if (normalized == null) return OperationStatus.PENDING
  if (normalized >= 0.9) return OperationStatus.APPROVED
  if (normalized >= 0.7) return OperationStatus.IN_CONFERENCE
  if (normalized >= 0.4) return OperationStatus.IN_REVIEW
  return OperationStatus.BLOCKED
}

export function toRegistrationStatus (status: OperationStatus): ApprovalStatusEnum {
  if (status === OperationStatus.APPROVED || status === OperationStatus.COMPLETED) {
    return ApprovalStatusEnum.AUTHORIZED
  }
  if (status === OperationStatus.BLOCKED) {
    return ApprovalStatusEnum.BLOCKED
  }
  if (status === OperationStatus.CANCELLED) {
    return ApprovalStatusEnum.NOT_AUTHORIZED
  }
  return ApprovalStatusEnum.PENDING
}

export const OPERATION_STATUS_LABELS: Record<OperationStatus, string> = {
  [OperationStatus.PENDING]: 'Pendente',
  [OperationStatus.IN_REVIEW]: 'Em revisão',
  [OperationStatus.IN_CONFERENCE]: 'Em conferência',
  [OperationStatus.COMPLETED]: 'Concluída',
  [OperationStatus.APPROVED]: 'Aprovada',
  [OperationStatus.BLOCKED]: 'Bloqueada',
  [OperationStatus.CANCELLED]: 'Cancelada',
}

const DOC_TYPE_STAGE: Record<string, { stage: ValidationStageEnum, title: string }> = {
  invoice: { stage: ValidationStageEnum.DOCUMENTAL, title: 'Conferência Documental' },
  nf: { stage: ValidationStageEnum.DOCUMENTAL, title: 'Nota Fiscal' },
  draft_document: { stage: ValidationStageEnum.DOCUMENTAL, title: 'Rascunho documental' },
  bl: { stage: ValidationStageEnum.BL, title: 'Conferência BL' },
  ce_mercante: { stage: ValidationStageEnum.CE_MERCANTE, title: 'CE Mercante' },
  ncm: { stage: ValidationStageEnum.NCM, title: 'Classificação NCM' },
  di: { stage: ValidationStageEnum.DOCUMENTAL, title: 'DI' },
  duimp: { stage: ValidationStageEnum.DOCUMENTAL, title: 'DUIMP' },
}

function stageFromDocType (docType: string | null | undefined) {
  const key = (docType ?? '').toLowerCase()
  return DOC_TYPE_STAGE[key] ?? {
    stage: ValidationStageEnum.DOCUMENTAL,
    title: docType ? `Documento ${docType}` : 'Documento',
  }
}

export function buildWorkflowFromDocuments (documents: DocumentLike[]): WorkflowStep[] {
  const base: WorkflowStep[] = [
    { stage: ValidationStageEnum.DOCUMENTAL, label: 'Invoice x DI', status: ValidationResultEnum.PENDING, progress: 0 },
    { stage: ValidationStageEnum.BL, label: 'BL', status: ValidationResultEnum.PENDING, progress: 0 },
    { stage: ValidationStageEnum.CE_MERCANTE, label: 'CE Mercante', status: ValidationResultEnum.PENDING, progress: 0 },
    { stage: ValidationStageEnum.NCM, label: 'NCM', status: ValidationResultEnum.PENDING, progress: 0 },
    { stage: ValidationStageEnum.BENEFICIOS, label: 'Benefícios', status: ValidationResultEnum.PENDING, progress: 0 },
    { stage: ValidationStageEnum.TRIBUTACAO, label: 'Tributação', status: ValidationResultEnum.PENDING, progress: 0 },
  ]

  for (const doc of documents) {
    const meta = stageFromDocType(doc.doc_type)
    const step = base.find((s) => s.stage === meta.stage)
    if (!step) continue
    const result = docResultStatus(doc.extraction_status)
    // Prioridade: rejected > warning > approved > pending
    const rank: Record<ValidationResultEnum, number> = {
      [ValidationResultEnum.PENDING]: 0,
      [ValidationResultEnum.SKIPPED]: 1,
      [ValidationResultEnum.APPROVED]: 2,
      [ValidationResultEnum.WARNING]: 3,
      [ValidationResultEnum.REJECTED]: 4,
    }
    if (rank[result] >= rank[step.status]) {
      step.status = result
      step.progress = result === ValidationResultEnum.PENDING
        ? 0
        : result === ValidationResultEnum.WARNING
          ? 80
          : 100
    }
  }

  return base
}

export function buildValidationCards (documents: DocumentLike[]): ValidationCardData[] {
  if (!documents.length) {
    return [{
      title: 'Extração documental',
      stage: ValidationStageEnum.DOCUMENTAL,
      status: ValidationResultEnum.PENDING,
      progress: 0,
      fieldsTotal: 0,
      fieldsApproved: 0,
      fieldsRejected: 0,
      aiSummary: 'Nenhum documento vinculado a este processo.',
    }]
  }

  return documents.map((doc) => {
    const meta = stageFromDocType(doc.doc_type)
    const status = docResultStatus(doc.extraction_status)
    const conf = normalizeConfidence(doc.confidence) ?? 0
    return {
      title: meta.title,
      stage: meta.stage,
      status,
      progress: status === ValidationResultEnum.PENDING ? Math.round(conf * 100) : 100,
      fieldsTotal: 1,
      fieldsApproved: status === ValidationResultEnum.APPROVED ? 1 : 0,
      fieldsRejected: status === ValidationResultEnum.REJECTED ? 1 : 0,
      aiSummary: doc.extraction_error
        || (doc.markdown_excerpt ? doc.markdown_excerpt.slice(0, 140) : undefined),
    }
  })
}

export function buildComparisonFields (process: ProcessLike): ComparisonField[] {
  const body = process.body_fields && !Array.isArray(process.body_fields)
    ? process.body_fields as Record<string, unknown>
    : {}

  const pairs: Array<[string, string, string]> = [
    ['Referência NIRRON', String(process.ref_nirron ?? '—'), String(process.ref_nirron ?? '—')],
    ['Cliente', String(process.ref_cliente ?? '—'), String(process.ref_cliente ?? '—')],
    ['Template', String(process.template_name ?? '—'), String(process.template_name ?? '—')],
    ['NCM', String(body.ncm ?? body.NCM ?? '—'), String(body.ncm ?? body.NCM ?? '—')],
    ['DI', String(body.di ?? body.di_number ?? '—'), String(body.di ?? body.di_number ?? '—')],
  ]

  return pairs.map(([label, a, b]) => ({
    label,
    sourceA: a,
    sourceB: b,
    result: a !== '—' && a === b ? ValidationResultEnum.APPROVED : ValidationResultEnum.PENDING,
    critical: label === 'NCM' && a !== b && a !== '—' && b !== '—',
  }))
}

export function buildRisks (documents: DocumentLike[], confidence: number | null): RiskItem[] {
  const risks: RiskItem[] = []
  const normalized = normalizeConfidence(confidence)

  for (const doc of documents) {
    if (doc.extraction_error) {
      risks.push({
        level: RiskLevel.HIGH,
        title: `Erro em ${doc.doc_type ?? 'documento'}`,
        description: doc.extraction_error,
        field: doc.doc_type ?? undefined,
      })
    }
    if (docResultStatus(doc.extraction_status) === ValidationResultEnum.REJECTED) {
      risks.push({
        level: RiskLevel.CRITICAL,
        title: `Documento rejeitado: ${doc.doc_type ?? doc.id}`,
        description: 'A extração/validação deste documento falhou e exige correção.',
        field: doc.doc_type ?? undefined,
      })
    }
  }

  if (normalized != null && normalized < 0.7) {
    risks.push({
      level: normalized < 0.4 ? RiskLevel.CRITICAL : RiskLevel.MEDIUM,
      title: 'Baixa confiança da extração',
      description: `Confidence do processo: ${Math.round(normalized * 100)}%. Revise os campos extraídos.`,
      field: 'confidence',
    })
  }

  return risks
}

export function buildTimeline (process: ProcessLike, documents: DocumentLike[]): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: 'created',
      title: 'Processo carregado',
      description: `Referência ${process.ref_nirron ?? process.id}`,
      timestamp: new Date().toISOString(),
      icon: 'mdi-database-import',
      color: 'primary',
    },
  ]

  for (const doc of documents) {
    const status = docResultStatus(doc.extraction_status)
    events.push({
      id: `doc-${doc.id}`,
      title: `Documento ${doc.doc_type ?? doc.id}`,
      description: doc.extraction_error
        || (status === ValidationResultEnum.APPROVED ? 'Extração concluída' : `Status: ${status}`),
      timestamp: new Date().toISOString(),
      icon: status === ValidationResultEnum.REJECTED
        ? 'mdi-alert-circle'
        : status === ValidationResultEnum.WARNING
          ? 'mdi-alert'
          : 'mdi-file-check',
      color: status === ValidationResultEnum.REJECTED
        ? 'error'
        : status === ValidationResultEnum.WARNING
          ? 'warning'
          : 'success',
    })
  }

  return events
}

export function buildAIResult (
  process: ProcessLike,
  documents: DocumentLike[],
  status: OperationStatus,
): AIResultData {
  const normalized = normalizeConfidence(process.confidence)
  const rejected = documents.filter((d) => docResultStatus(d.extraction_status) === ValidationResultEnum.REJECTED)
  const errors = documents.filter((d) => d.extraction_error).map((d) => d.extraction_error as string)

  if (status === OperationStatus.BLOCKED || rejected.length > 0) {
    return {
      summary: `Processo ${process.ref_nirron ?? process.id} com pendências críticas na extração/validação documental.`,
      confidence: Math.round((normalized ?? 0.4) * 100),
      recommendation: 'Registro NÃO AUTORIZADO. Corrija os documentos rejeitados antes de prosseguir.',
      risks: [
        ...rejected.map((d) => `Documento rejeitado: ${d.doc_type ?? d.id}`),
        ...errors.slice(0, 3),
      ],
      approved: false,
    }
  }

  if (status === OperationStatus.IN_REVIEW || status === OperationStatus.IN_CONFERENCE) {
    return {
      summary: `Processo em andamento com confidence ${Math.round((normalized ?? 0) * 100)}%.`,
      confidence: Math.round((normalized ?? 0.6) * 100),
      recommendation: 'Aguardando conclusão das validações restantes.',
      risks: errors.slice(0, 3),
      approved: false,
    }
  }

  return {
    summary: `Processo ${process.ref_nirron ?? process.id} com documentos consistentes.`,
    confidence: Math.round((normalized ?? 0.9) * 100),
    recommendation: 'Registro AUTORIZADO com base nos documentos disponíveis.',
    risks: [],
    approved: true,
  }
}

export function resolveCurrentStage (
  steps: WorkflowStep[],
): ValidationStageEnum {
  const firstOpen = steps.find((s) =>
    s.status === ValidationResultEnum.PENDING
    || s.status === ValidationResultEnum.WARNING
    || s.status === ValidationResultEnum.REJECTED,
  )
  return firstOpen?.stage ?? ValidationStageEnum.TRIBUTACAO
}

export type { DocumentItem, ProcessLike, DocumentLike }
