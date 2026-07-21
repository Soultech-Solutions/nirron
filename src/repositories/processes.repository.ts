import type {
  AIResultData,
  ComparisonField,
  DocumentItem,
  RiskItem,
  TimelineEvent,
  ValidationCardData,
  WorkflowStep,
} from '@/components/domain/types'
import type { ImportDetailDto, ImportListItemDto, ImportListQueryDto } from '@/dtos'
import { ValidationResultEnum } from '@/enums'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants'
import {
  buildTimeline,
} from '@/imports/processStatus'
import { runConferenceAnalysis } from '@/validation/conference.engine'
import { resolveCeNumber, resolveImportReferenceFields, buildExtractedFieldMap } from '@/services/api/mercante.service'
import { directusGetById, directusList } from '@/services/api/directus.items'
import { getAccessToken } from '@/utils'

/**
 * Campos reais da collection `processes` no Directus NIRRON
 */
export interface DirectusProcess {
  id: string | number
  ref_nirron?: string | null
  ref_cliente?: string | null
  template_name?: string | null
  body_fields?: Record<string, unknown> | unknown[] | null
  confidence?: number | null
  date_created?: string | null
  date_updated?: string | null
  email_id?: string | number | DirectusEmailRef | null
  documents?: DirectusDocument[] | null
}

export interface DirectusEmailRef {
  id: string | number
  subject?: string | null
  received_at?: string | null
  /** emails.created_at (não é date_created do Directus) */
  created_at?: string | null
  /** emails.updated_at (não é date_updated do Directus) */
  updated_at?: string | null
  status?: string | null
}

export interface DirectusDocument {
  id: string | number
  process_id?: string | number | null
  attachment_id?: string | number | DirectusAttachment | null
  doc_type?: string | null
  markdown_excerpt?: string | null
  extracted_fields?: Record<string, unknown> | null
  confidence?: number | null
  extraction_status?: string | null
  extraction_error?: string | null
}

export interface DirectusAttachment {
  id: string | number
  filename?: string | null
  mime_type?: string | null
  storage_path?: string | null
  content_hash?: string | null
  from_zip?: boolean | null
}

export interface ProcessDetailPayload {
  detail: ImportDetailDto
  documents: DocumentItem[]
  workflowSteps: WorkflowStep[]
  validationCards: ValidationCardData[]
  comparisonFields: ComparisonField[]
  risks: RiskItem[]
  timeline: TimelineEvent[]
  aiResult: AIResultData
  /** Campos achatados da extração (e-mails/documentos) para cruzamento Mercante */
  extractedFieldMap: Record<string, string>
}

function resolveAttachment (
  attachment: DirectusDocument['attachment_id'],
): DirectusAttachment | null {
  if (attachment == null || attachment === '') return null
  if (typeof attachment === 'object') return attachment
  return { id: attachment }
}

/** Directus file/asset id — prefer explicit id, then `directus:{file_id}` em storage_path */
function resolveAssetId (attachment: DirectusAttachment | null): string | undefined {
  if (!attachment) return undefined

  const path = attachment.storage_path?.trim()
  if (path) {
    const directusRef = /^directus:(.+)$/i.exec(path)
    if (directusRef?.[1]) return directusRef[1].trim()
  }

  if (attachment.id != null && attachment.id !== '') return String(attachment.id)
  return undefined
}

/**
 * URL pública do arquivo no Directus: `{API_BASE_URL}/assets/{asset_id}`.
 * Inclui access_token para preview em <iframe>/<img> (sem header Authorization).
 */
function resolveDownloadUrl (attachment: DirectusAttachment | null): string | undefined {
  const assetId = resolveAssetId(attachment)
  if (!assetId) {
    const path = attachment?.storage_path?.trim()
    if (path && /^https?:\/\//i.test(path)) return path
    return undefined
  }

  const base = API_BASE_URL.replace(/\/$/, '')
  const url = `${base}/assets/${assetId}`
  const token = getAccessToken()
  return token ? `${url}?access_token=${encodeURIComponent(token)}` : url
}

function formatSizeFromContent (content?: string | null): string {
  if (!content) return '—'
  const bytes = new TextEncoder().encode(content).length
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function mapDocValidationStatus (statusRaw: string): ValidationResultEnum {
  const value = statusRaw.toLowerCase()
  if (value.includes('error') || value.includes('fail') || value.includes('reject')) {
    return ValidationResultEnum.REJECTED
  }
  if (value.includes('warn')) return ValidationResultEnum.WARNING
  if (
    value.includes('done')
    || value.includes('success')
    || value.includes('ok')
    || value.includes('approved')
    || value.includes('complete')
  ) {
    return ValidationResultEnum.APPROVED
  }
  return ValidationResultEnum.PENDING
}

function resolveEmailId (emailId: DirectusProcess['email_id']): string | undefined {
  if (emailId == null || emailId === '') return undefined
  if (typeof emailId === 'object') return String(emailId.id)
  return String(emailId)
}

function resolveEmailSubject (emailId: DirectusProcess['email_id']): string | undefined {
  if (!emailId || typeof emailId !== 'object') return undefined
  const subject = emailId.subject?.trim()
  return subject || undefined
}

/** Quando o expand aninhado falha, busca subject/datas em /items/emails. */
async function hydrateEmails (processes: DirectusProcess[]): Promise<DirectusProcess[]> {
  const ids = [
    ...new Set(
      processes
        .map((process) => resolveEmailId(process.email_id))
        .filter((id): id is string => Boolean(id)),
    ),
  ]
  if (!ids.length) return processes

  const alreadyExpanded = processes.every((process) => {
    const email = process.email_id
    return !email || (typeof email === 'object' && Boolean(email.subject?.trim()))
  })
  if (alreadyExpanded) return processes

  try {
    const response = await directusList<DirectusEmailRef>(
      API_ENDPOINTS.DIRECTUS.EMAILS,
      {
        limit: Math.max(ids.length, 1),
        filter: { id: { _in: ids } },
        fields: ['id', 'subject', 'created_at', 'updated_at', 'received_at'],
      },
    )

    const byId = new Map(
      response.data.map((email) => [String(email.id), email] as const),
    )

    return processes.map((process) => {
      const emailId = resolveEmailId(process.email_id)
      if (!emailId) return process
      const email = byId.get(emailId)
      if (!email) return process

      const current = typeof process.email_id === 'object' && process.email_id != null
        ? process.email_id
        : { id: emailId }

      return {
        ...process,
        email_id: {
          ...current,
          ...email,
          id: email.id,
        },
      }
    })
  } catch {
    return processes
  }
}

const BODY_DATE_ALIASES = new Set([
  'date_created',
  'date_updated',
  'created_at',
  'updated_at',
  'created_date',
  'updated_date',
  'data_criacao',
  'data_atualizacao',
  'received_at',
  'received_date',
  'data_recebimento',
  'email_date',
  'sent_at',
  'data_email',
])

function parseTimestamp (value: unknown): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function normalizeBodyKey (value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function timestampFromBodyFields (body: DirectusProcess['body_fields']): string | undefined {
  if (!body || Array.isArray(body) || typeof body !== 'object') return undefined

  let result: string | undefined
  const walk = (source: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(source)) {
      if (result) return
      if (BODY_DATE_ALIASES.has(normalizeBodyKey(key))) {
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

function resolveProcessTimestamps (process: DirectusProcess): {
  createdAt: string
  updatedAt: string
} {
  const email = typeof process.email_id === 'object' && process.email_id != null
    ? process.email_id
    : null

  const fromBody = timestampFromBodyFields(process.body_fields)

  const createdAt
    = parseTimestamp(process.date_created)
      ?? parseTimestamp(email?.created_at)
      ?? parseTimestamp(email?.received_at)
      ?? fromBody
      ?? ''

  const updatedAt
    = parseTimestamp(process.date_updated)
      ?? parseTimestamp(email?.updated_at)
      ?? parseTimestamp(email?.received_at)
      ?? parseTimestamp(email?.created_at)
      ?? parseTimestamp(process.date_created)
      ?? fromBody
      ?? createdAt

  return { createdAt, updatedAt }
}

function mapDocument (doc: DirectusDocument): DocumentItem {
  const attachment = resolveAttachment(doc.attachment_id)
  const assetId = resolveAssetId(attachment)
  const fileName = attachment?.filename
    || (doc.doc_type ? `${doc.doc_type}.md` : `documento-${doc.id}.md`)

  return {
    id: String(doc.id),
    name: fileName,
    type: doc.doc_type ?? 'document',
    size: formatSizeFromContent(doc.markdown_excerpt),
    uploadedAt: new Date().toISOString(),
    status: mapDocValidationStatus(doc.extraction_status ?? ''),
    content: doc.markdown_excerpt ?? undefined,
    mimeType: attachment?.mime_type ?? 'text/markdown',
    downloadUrl: resolveDownloadUrl(attachment),
    attachmentId: assetId,
  }
}

function mapProcessToListItem (process: DirectusProcess): ImportListItemDto {
  const refs = resolveImportReferenceFields({
    bodyFields: process.body_fields,
    documents: process.documents,
  })
  const refNirron = process.ref_nirron?.trim() || `PROC-${process.id}`
  const cliente = process.ref_cliente?.trim()
    || refs.importer
    || '—'
  const ncm = refs.ncm || '—'
  // Mesma fonte do detalhe: motor de conferência (evita "Aprovada" só por extração de PDF)
  const status = runConferenceAnalysis(process).operationStatus
  const { createdAt, updatedAt } = resolveProcessTimestamps(process)

  return {
    id: String(process.id),
    company: cliente,
    importer: cliente,
    exporter: refs.exporter || '—',
    diNumber: refs.diNumber,
    duimpNumber: refs.duimpNumber,
    invoiceNumber: refs.invoiceNumber || refNirron,
    container: refs.container,
    ncm,
    blNumber: refs.blNumber,
    emailId: resolveEmailId(process.email_id),
    emailSubject: resolveEmailSubject(process.email_id),
    status,
    createdAt,
    updatedAt,
  }
}

function mapProcessToDetail (
  process: DirectusProcess,
  status: ImportListItemDto['status'],
  currentStage: ImportDetailDto['currentStage'],
  registrationStatus: ImportDetailDto['registrationStatus'],
): ImportDetailDto {
  const base = mapProcessToListItem(process)
  const refs = resolveImportReferenceFields({
    bodyFields: process.body_fields,
    documents: process.documents,
  })

  return {
    ...base,
    status,
    client: refs.importer || base.importer,
    supplier: refs.exporter || base.exporter,
    incoterm: refs.incoterm || '—',
    currency: refs.currency || 'USD',
    totalFobValue: refs.totalFobValue ?? 0,
    currentStage,
    registrationStatus,
    weightNet: refs.weightNet,
    weightGross: refs.weightGross,
    ceNumber: refs.ceNumber || resolveCeNumber({
      bodyFields: process.body_fields,
      documents: process.documents,
    }) || undefined,
  }
}

function buildDetailPayload (process: DirectusProcess): ProcessDetailPayload {
  const docs = process.documents ?? []
  const analysis = runConferenceAnalysis(process)

  return {
    detail: mapProcessToDetail(
      process,
      analysis.operationStatus,
      analysis.currentStage,
      analysis.registrationStatus,
    ),
    documents: docs.map(mapDocument),
    workflowSteps: analysis.workflowSteps,
    validationCards: analysis.validationCards,
    comparisonFields: analysis.comparisonFields,
    risks: analysis.risks,
    timeline: buildTimeline(process, docs),
    aiResult: analysis.aiResult,
    extractedFieldMap: buildExtractedFieldMap({
      bodyFields: process.body_fields,
      documents: docs,
    }),
  }
}

/** Lista: email expandido cedo; datas do process são opcionais (fallback abaixo) */
export const PROCESS_LIST_FIELDS = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'email_id.id',
  'email_id.subject',
  'email_id.created_at',
  'email_id.updated_at',
  'documents.id',
  'documents.doc_type',
  'documents.extraction_status',
  'documents.extraction_error',
  'documents.confidence',
  'documents.extracted_fields',
].join(',')

const PROCESS_LIST_FIELDS_WITH_PROCESS_DATES = [
  PROCESS_LIST_FIELDS,
  'date_created',
  'date_updated',
].join(',')

const PROCESS_LIST_FIELDS_EMAIL_ONLY = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'email_id.id',
  'email_id.subject',
  'email_id.created_at',
  'email_id.updated_at',
].join(',')

const PROCESS_LIST_FIELDS_BASIC = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'email_id',
].join(',')

const PROCESS_DETAIL_FIELDS_BASIC = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'email_id.id',
  'email_id.subject',
  'email_id.created_at',
  'email_id.updated_at',
  'documents.id',
  'documents.doc_type',
  'documents.markdown_excerpt',
  'documents.extracted_fields',
  'documents.confidence',
  'documents.extraction_status',
  'documents.extraction_error',
].join(',')

const PROCESS_DETAIL_FIELDS_NO_SYSTEM_DATES = PROCESS_DETAIL_FIELDS_BASIC

const PROCESS_DETAIL_FIELDS = [
  PROCESS_DETAIL_FIELDS_BASIC,
  'documents.attachment_id.id',
  'documents.attachment_id.filename',
  'documents.attachment_id.mime_type',
  'documents.attachment_id.storage_path',
].join(',')

class ProcessesRepository {
  async list (query?: ImportListQueryDto) {
    const page = query?.page ?? 1
    const limit = query?.perPage ?? 10
    const sortField = mapSortField(query?.sortBy)
    const sortDir = query?.sortOrder === 'asc' ? '' : '-'
    const preferredSort = `${sortDir}${sortField}`
    const sorts = preferredSort === '-id' || preferredSort === 'id'
      ? [preferredSort]
      : [preferredSort, '-id']

    const fieldSets = [
      PROCESS_LIST_FIELDS_WITH_PROCESS_DATES,
      PROCESS_LIST_FIELDS,
      PROCESS_LIST_FIELDS_EMAIL_ONLY,
      PROCESS_LIST_FIELDS_BASIC,
    ]

    let lastError: unknown
    for (const fields of fieldSets) {
      for (const sort of sorts) {
        try {
          const response = await directusList<DirectusProcess>(
            API_ENDPOINTS.DIRECTUS.PROCESSES,
            {
              page,
              limit,
              search: query?.search || undefined,
              sort,
              fields,
            },
          )

          const hydrated = await hydrateEmails(response.data)

          return {
            data: hydrated.map(mapProcessToListItem),
            meta: response.meta,
          }
        } catch (error) {
          lastError = error
        }
      }
    }

    throw lastError
  }

  async getDetail (id: string): Promise<ProcessDetailPayload> {
    const fieldSets = [
      PROCESS_DETAIL_FIELDS,
      PROCESS_DETAIL_FIELDS_BASIC,
      'id,ref_nirron,ref_cliente,template_name,body_fields,confidence,email_id',
    ]

    let lastError: unknown
    for (const fields of fieldSets) {
      try {
        const process = await directusGetById<DirectusProcess>(
          API_ENDPOINTS.DIRECTUS.PROCESS_BY_ID(id),
          { params: { fields } },
        )
        const [hydrated] = await hydrateEmails([process])
        return buildDetailPayload(hydrated)
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }
}

function mapSortField (sortBy?: string): string {
  switch (sortBy) {
    case 'company':
      return 'ref_cliente'
    case 'invoiceNumber':
      return 'ref_nirron'
    case 'createdAt':
      return 'date_created'
    case 'updatedAt':
      return 'date_updated'
    default:
      return 'id'
  }
}

export const processesRepository = new ProcessesRepository()

export { mapProcessToListItem, mapDocument }
