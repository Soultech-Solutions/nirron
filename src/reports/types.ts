import type { ID, Timestamp } from '@/types'
import type { RegistrationStatus, ValidationSummary } from '@/types'

export interface ValidationReport extends ValidationSummary {
  id: ID
  generatedAt: Timestamp
  generatedBy: string
}

export interface ReportFilter {
  startDate?: string
  endDate?: string
  clientId?: ID
  registrationStatus?: RegistrationStatus
}
