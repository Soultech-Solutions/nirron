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
  responsible: string
  status: OperationStatus
  createdAt: string
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
}

export interface ImportExportDto {
  ids?: string[]
  format: 'xlsx' | 'csv' | 'pdf'
  filters?: ImportListQueryDto
}
