import type { ID, Timestamp } from '@/types'

export interface ImportOperation {
  id: ID
  diNumber?: string
  duimpNumber?: string
  invoiceNumber: string
  exporterName: string
  importerCnpj: string
  incoterm: string
  currency: string
  totalFobValue: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ImportDocument {
  id: ID
  operationId: ID
  type: 'invoice' | 'bl' | 'ce_mercante' | 'di' | 'duimp'
  fileName: string
  uploadedAt: Timestamp
}
