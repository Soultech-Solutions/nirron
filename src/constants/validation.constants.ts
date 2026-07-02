/**
 * Constantes alinhadas ao domínio NIRRON (conferência aduaneira).
 * Referência: etapas e níveis de bloqueio do sistema.
 */

export const VALIDATION_STAGES = {
  DOCUMENTAL: 'documental',
  BL: 'bl',
  CE_MERCANTE: 'ce_mercante',
  NCM: 'ncm',
  BENEFICIOS: 'beneficios',
  TRIBUTACAO: 'tributacao',
} as const

export const VALIDATION_STAGE_LABELS: Record<
  (typeof VALIDATION_STAGES)[keyof typeof VALIDATION_STAGES],
  string
> = {
  [VALIDATION_STAGES.DOCUMENTAL]: 'Conferência Documental',
  [VALIDATION_STAGES.BL]: 'Conferência BL',
  [VALIDATION_STAGES.CE_MERCANTE]: 'CE Mercante',
  [VALIDATION_STAGES.NCM]: 'Classificação Fiscal NCM',
  [VALIDATION_STAGES.BENEFICIOS]: 'Benefícios Fiscais',
  [VALIDATION_STAGES.TRIBUTACAO]: 'Recálculo Tributário',
}

export const BLOCKAGE_LEVELS = {
  LEVEL_1: 1,
  LEVEL_2: 2,
} as const

export const BLOCKAGE_LEVEL_LABELS: Record<
  (typeof BLOCKAGE_LEVELS)[keyof typeof BLOCKAGE_LEVELS],
  string
> = {
  [BLOCKAGE_LEVELS.LEVEL_1]: 'Bloqueio total',
  [BLOCKAGE_LEVELS.LEVEL_2]: 'Aprovação supervisor',
}

export const REGISTRATION_STATUS = {
  AUTHORIZED: 'authorized',
  NOT_AUTHORIZED: 'not_authorized',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
} as const

export const REGISTRATION_STATUS_LABELS: Record<
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS],
  string
> = {
  [REGISTRATION_STATUS.AUTHORIZED]: 'Registro autorizado',
  [REGISTRATION_STATUS.NOT_AUTHORIZED]: 'Registro não autorizado',
  [REGISTRATION_STATUS.PENDING]: 'Pendente',
  [REGISTRATION_STATUS.IN_PROGRESS]: 'Em andamento',
}

export const VALIDATION_RESULT = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WARNING: 'warning',
  SKIPPED: 'skipped',
} as const
