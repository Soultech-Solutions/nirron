import type { ComparisonField, ValidationCardData } from '@/components/domain/types'
import { API_TIMEOUT } from '@/constants'
import { RiskLevel, ValidationResultEnum, ValidationStageEnum } from '@/enums'

export interface MercanteValidateRequest {
  ce_number: string
  save?: boolean
}

export interface MercanteValidateResponse {
  cubagem_m3?: string | number | null
  peso_bruto_kg?: string | number | null
  cpf_cnpj_consignatario?: string | null
  [key: string]: unknown
}

export interface MercanteCrossCheckResult {
  fields: ComparisonField[]
  approved: number
  rejected: number
  pending: number
  summary: string
}

const MERCANTE_BASE_URL
  = (import.meta.env.VITE_MERCANTE_API_URL as string | undefined)?.replace(/\/$/, '')
    ?? '/mercante/ce'

/** Campos do Mercante a cruzar com a extração dos e-mails/documentos */
const MERCANTE_CROSS_FIELDS = [
  {
    mercanteKey: 'cubagem_m3',
    label: 'Cubagem (m³)',
    aliases: ['cubagem_m3', 'cubagem', 'cubage', 'cbm', 'volume'],
    critical: false,
    kind: 'number' as const,
  },
  {
    mercanteKey: 'peso_bruto_kg',
    label: 'Peso bruto (kg)',
    aliases: ['peso_bruto_kg', 'peso_bruto', 'weight_gross', 'gross_weight', 'peso'],
    critical: false,
    kind: 'number' as const,
  },
  {
    mercanteKey: 'cpf_cnpj_consignatario',
    label: 'CPF/CNPJ consignatário',
    aliases: [
      'cpf_cnpj_consignatario',
      'cnpj_consignatario',
      'cpf_consignatario',
      'consignee_cnpj',
      'cnpj',
      'cpf_cnpj',
      'consignatario',
      'consignee',
    ],
    critical: true,
    kind: 'document' as const,
  },
] as const

const CE_ALIASES = [
  'ce_number',
  'ce_mercante',
  'ce',
  'conhecimento_eletronico',
  'numero_ce',
  'nr_ce',
]

/**
 * Consulta CE Mercante (POST).
 * Em dev, use o proxy Vite `/mercante/ce` → https://nirron-mercante.soultech.solutions/ce
 */
export async function validateMercanteCe (
  payload: MercanteValidateRequest,
): Promise<MercanteValidateResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(MERCANTE_BASE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ce_number: payload.ce_number,
        save: payload.save ?? true,
      }),
      signal: controller.signal,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = typeof data === 'object' && data && 'message' in data
        ? String((data as { message: unknown }).message)
        : `Falha na consulta Mercante (${response.status})`
      throw new Error(message)
    }

    return data as MercanteValidateResponse
  } finally {
    window.clearTimeout(timeout)
  }
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
    for (const key of ['value', 'nome', 'name', 'codigo', 'code', 'text', 'numero']) {
      if (record[key] != null) return stringifyValue(record[key])
    }
  }
  return String(value)
}

export function flattenExtractedFields (
  source: Record<string, unknown> | null | undefined,
): Record<string, string> {
  if (!source) return {}
  const out: Record<string, string> = {}

  const walk = (obj: Record<string, unknown>, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        walk(value as Record<string, unknown>, path)
        continue
      }
      const text = stringifyValue(value)
      if (!text) continue
      out[normalizeKey(key)] = text
      out[normalizeKey(path)] = text
    }
  }

  walk(source)
  return out
}

function pickFromMap (bag: Record<string, string>, aliases: readonly string[]): string {
  for (const alias of aliases) {
    const found = bag[normalizeKey(alias)]
    if (found) return found
  }
  return ''
}

/** Monta mapa único dos campos extraídos (body + documentos). */
export function buildExtractedFieldMap (input: {
  bodyFields?: Record<string, unknown> | unknown[] | null
  documents?: Array<{ extracted_fields?: Record<string, unknown> | null }> | null
}): Record<string, string> {
  let bag: Record<string, string> = {}

  if (input.bodyFields && !Array.isArray(input.bodyFields)) {
    bag = { ...bag, ...flattenExtractedFields(input.bodyFields) }
  }

  for (const doc of input.documents ?? []) {
    bag = { ...bag, ...flattenExtractedFields(doc.extracted_fields ?? undefined) }
  }

  return bag
}

/** Extrai número CE de body_fields / extracted_fields dos documentos. */
export function resolveCeNumber (input: {
  bodyFields?: Record<string, unknown> | unknown[] | null
  documents?: Array<{ extracted_fields?: Record<string, unknown> | null }> | null
}): string {
  const bag = buildExtractedFieldMap(input)
  return pickFromMap(bag, CE_ALIASES)
}

function normalizeDocumentId (value: string): string {
  return value.replace(/\D+/g, '')
}

function valuesMatch (a: string, b: string, kind: 'number' | 'document' | 'text'): boolean {
  if (!a || !b) return false

  if (kind === 'document') {
    const left = normalizeDocumentId(a)
    const right = normalizeDocumentId(b)
    return Boolean(left) && left === right
  }

  if (kind === 'number') {
    const numLeft = Number(a.replace(',', '.').replace(/[^\d.-]/g, ''))
    const numRight = Number(b.replace(',', '.').replace(/[^\d.-]/g, ''))
    if (Number.isNaN(numLeft) || Number.isNaN(numRight)) return false
    return Math.abs(numLeft - numRight) < 0.01
  }

  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

/**
 * Cruza resposta do Mercante com campos extraídos dos e-mails/documentos.
 */
export function crossCheckMercanteWithExtracted (
  mercante: MercanteValidateResponse,
  extracted: Record<string, string>,
): MercanteCrossCheckResult {
  const mercanteBag = flattenExtractedFields(mercante as Record<string, unknown>)

  const fields: ComparisonField[] = MERCANTE_CROSS_FIELDS.map((rule) => {
    const mercanteValue = pickFromMap(mercanteBag, [rule.mercanteKey])
      || stringifyValue(mercante[rule.mercanteKey])
    const extractedValue = pickFromMap(extracted, rule.aliases)

    let result = ValidationResultEnum.PENDING
    if (!mercanteValue && !extractedValue) {
      result = ValidationResultEnum.PENDING
    } else if (!mercanteValue || !extractedValue) {
      result = rule.critical ? ValidationResultEnum.REJECTED : ValidationResultEnum.WARNING
    } else if (valuesMatch(mercanteValue, extractedValue, rule.kind)) {
      result = ValidationResultEnum.APPROVED
    } else {
      result = rule.critical ? ValidationResultEnum.REJECTED : ValidationResultEnum.WARNING
    }

    return {
      label: rule.label,
      sourceA: mercanteValue || '—',
      sourceB: extractedValue || '—',
      result,
      critical: rule.critical && result === ValidationResultEnum.REJECTED,
    }
  })

  const approved = fields.filter((f) => f.result === ValidationResultEnum.APPROVED).length
  const rejected = fields.filter((f) => f.result === ValidationResultEnum.REJECTED).length
  const pending = fields.filter((f) => f.result === ValidationResultEnum.PENDING).length

  const summary = rejected
    ? `${rejected} divergência(s) Mercante × extração`
    : approved === fields.length
      ? 'Cubagem, peso e consignatário conferidos com o Mercante'
      : `${approved}/${fields.length} campos conferidos; aguardando dados restantes`

  return { fields, approved, rejected, pending, summary }
}

/** Atualiza o card CE Mercante com o resultado do cruzamento ao vivo. */
export function applyMercanteCrossCheckToCards (
  cards: ValidationCardData[],
  crossCheck: MercanteCrossCheckResult,
): ValidationCardData[] {
  return cards.map((card) => {
    if (card.stage !== ValidationStageEnum.CE_MERCANTE) return card

    const status = crossCheck.rejected
      ? ValidationResultEnum.REJECTED
      : crossCheck.pending
        ? ValidationResultEnum.WARNING
        : ValidationResultEnum.APPROVED

    return {
      ...card,
      status,
      progress: Math.round((crossCheck.approved / Math.max(crossCheck.fields.length, 1)) * 100),
      fieldsTotal: crossCheck.fields.length,
      fieldsApproved: crossCheck.approved,
      fieldsRejected: crossCheck.rejected,
      aiSummary: crossCheck.summary,
    }
  })
}

export function mercanteCrossCheckRisks (crossCheck: MercanteCrossCheckResult) {
  return crossCheck.fields
    .filter((f) => f.result === ValidationResultEnum.REJECTED || f.result === ValidationResultEnum.WARNING)
    .map((f) => ({
      level: f.critical ? RiskLevel.CRITICAL : RiskLevel.HIGH,
      title: `Mercante — ${f.label}`,
      description: `Mercante: ${f.sourceA} × Extração: ${f.sourceB}`,
      field: f.label,
    }))
}
