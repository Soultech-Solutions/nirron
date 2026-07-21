import type { OperationStatus, ValidationStageEnum } from '@/enums'
import type { ListQueryDto } from './common.dto'

export interface ImportListQueryDto extends ListQueryDto {
  status?: OperationStatus
  documentType?: 'DI' | 'DUIMP'
  dateFrom?: string
  dateTo?: string
  responsibleId?: string
}

export interface ImportListItemDto {
  id: string
  company: string
  importer: string
  exporter: string
  diNumber?: string
  duimpNumber?: string
  invoiceNumber: string
  container?: string
  ncm: string
  /** @deprecated Não há responsável no processo; template pertence a attachments */
  responsible?: string
  /** House/Master BL quando disponível */
  blNumber?: string
  /** UUID do e-mail no miner (emails.id); necessário para reprocessar docs */
  emailId?: string
  /** Assunto do e-mail vinculado (emails.subject) */
  emailSubject?: string
  status: OperationStatus
  /** ISO; vazio quando o Directus não expõe data */
  createdAt: string
  /** ISO; vazio quando o Directus não expõe data */
  updatedAt: string
}

export interface ImportDetailDto extends ImportListItemDto {
  client: string
  supplier: string
  incoterm: string
  currency: string
  totalFobValue: number
  currentStage: ValidationStageEnum
  registrationStatus: string
  weightNet?: number
  weightGross?: number
  /** Número CE Mercante quando disponível nos campos extraídos */
  ceNumber?: string
}

export interface ImportExportDto {
  ids?: string[]
  format: 'xlsx' | 'csv' | 'pdf'
  filters?: ImportListQueryDto
}
