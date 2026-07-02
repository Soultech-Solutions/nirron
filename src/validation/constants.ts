export { VALIDATION_STAGES, BLOCKAGE_LEVELS, REGISTRATION_STATUS } from '@/constants'

export const RECOMMENDED_VALIDATION_RULES_COUNT = 200

export const CRITICAL_FIELDS = [
  'exporter_name',
  'exporter_country',
  'importer_name',
  'importer_cnpj',
  'incoterm',
  'currency',
  'quantity',
  'total_fob_value',
  'unit_value',
] as const
