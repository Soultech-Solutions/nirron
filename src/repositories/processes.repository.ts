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
import { API_ENDPOINTS } from '@/constants'
import {
  buildTimeline,
} from '@/imports/processStatus'
import { runConferenceAnalysis } from '@/validation/conference.engine'
import { resolveCeNumber, buildExtractedFieldMap } from '@/services/api/mercante.service'
import { directusGetById, directusList } from '@/services/api/directus.items'

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
  email_id?: string | number | { id: string | number } | null
  documents?: DirectusDocument[] | null
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

function readBodyField (body: DirectusProcess['body_fields'], key: string): string {
  if (!body || Array.isArray(body) || typeof body !== 'object') return ''
  const value = (body as Record<string, unknown>)[key]
  return value == null ? '' : String(value)
}

function resolveAttachment (
  attachment: DirectusDocument['attachment_id'],
): DirectusAttachment | null {
  if (!attachment || typeof attachment !== 'object') return null
  return attachment
}

function resolveDownloadUrl (attachment: DirectusAttachment | null): string | undefined {
  const path = attachment?.storage_path?.trim()
  if (!path) return undefined
  if (/^https?:\/\//i.test(path)) return path
  return undefined
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

function mapDocument (doc: DirectusDocument): DocumentItem {
  const attachment = resolveAttachment(doc.attachment_id)
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
    attachmentId: attachment ? String(attachment.id) : undefined,
  }
}

function mapProcessToListItem (process: DirectusProcess): ImportListItemDto {
  const refNirron = process.ref_nirron?.trim() || `PROC-${process.id}`
  const cliente = process.ref_cliente?.trim() || process.template_name?.trim() || '—'
  const ncm = readBodyField(process.body_fields, 'ncm')
    || readBodyField(process.body_fields, 'NCM')
    || '—'
  const now = new Date().toISOString()
  // Mesma fonte do detalhe: motor de conferência (evita "Aprovada" só por extração de PDF)
  const status = runConferenceAnalysis(process).operationStatus

  return {
    id: String(process.id),
    company: cliente,
    importer: cliente,
    exporter: readBodyField(process.body_fields, 'exportador')
      || readBodyField(process.body_fields, 'exporter')
      || '—',
    diNumber: readBodyField(process.body_fields, 'di')
      || readBodyField(process.body_fields, 'di_number')
      || undefined,
    duimpNumber: readBodyField(process.body_fields, 'duimp')
      || readBodyField(process.body_fields, 'duimp_number')
      || undefined,
    invoiceNumber: refNirron,
    container: readBodyField(process.body_fields, 'container') || undefined,
    ncm,
    responsible: process.template_name?.trim() || '—',
    status,
    createdAt: now,
    updatedAt: now,
  }
}

function mapProcessToDetail (
  process: DirectusProcess,
  status: ImportListItemDto['status'],
  currentStage: ImportDetailDto['currentStage'],
  registrationStatus: ImportDetailDto['registrationStatus'],
): ImportDetailDto {
  const base = mapProcessToListItem(process)
  const body = process.body_fields && !Array.isArray(process.body_fields)
    ? process.body_fields as Record<string, unknown>
    : {}

  return {
    ...base,
    status,
    client: base.importer,
    supplier: base.exporter,
    incoterm: String(body.incoterm ?? body.Incoterm ?? '—'),
    currency: String(body.currency ?? body.moeda ?? 'USD'),
    totalFobValue: Number(body.total_fob ?? body.valor_fob ?? 0),
    currentStage,
    registrationStatus,
    weightNet: body.peso_liquido != null ? Number(body.peso_liquido) : undefined,
    weightGross: body.peso_bruto != null ? Number(body.peso_bruto) : undefined,
    ceNumber: resolveCeNumber({
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

/** Lista: inclui status de documentos para status consistente com o detalhe */
export const PROCESS_LIST_FIELDS = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'documents.id',
  'documents.doc_type',
  'documents.extraction_status',
  'documents.extraction_error',
  'documents.confidence',
  'documents.extracted_fields',
].join(',')

const PROCESS_DETAIL_FIELDS_BASIC = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
  'email_id',
  'documents.id',
  'documents.doc_type',
  'documents.markdown_excerpt',
  'documents.extracted_fields',
  'documents.confidence',
  'documents.extraction_status',
  'documents.extraction_error',
].join(',')

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

    try {
      const response = await directusList<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESSES,
        {
          page,
          limit,
          search: query?.search || undefined,
          sort: `${sortDir}${sortField}`,
          fields: PROCESS_LIST_FIELDS,
        },
      )

      return {
        data: response.data.map(mapProcessToListItem),
        meta: response.meta,
      }
    } catch {
      // Fallback sem relação documents (permissões)
      const response = await directusList<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESSES,
        {
          page,
          limit,
          search: query?.search || undefined,
          sort: `${sortDir}${sortField}`,
          fields: 'id,ref_nirron,ref_cliente,template_name,body_fields,confidence',
        },
      )

      return {
        data: response.data.map(mapProcessToListItem),
        meta: response.meta,
      }
    }
  }

  async getDetail (id: string): Promise<ProcessDetailPayload> {
    try {
      const process = await directusGetById<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESS_BY_ID(id),
        { params: { fields: PROCESS_DETAIL_FIELDS } },
      )
      return buildDetailPayload(process)
    } catch {
      const process = await directusGetById<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESS_BY_ID(id),
        { params: { fields: PROCESS_DETAIL_FIELDS_BASIC } },
      )
      return buildDetailPayload(process)
    }
  }
}

function mapSortField (sortBy?: string): string {
  switch (sortBy) {
    case 'company':
      return 'ref_cliente'
    case 'invoiceNumber':
      return 'ref_nirron'
    case 'createdAt':
    case 'updatedAt':
    default:
      return 'id'
  }
}

export const processesRepository = new ProcessesRepository()

export { mapProcessToListItem, mapDocument }
