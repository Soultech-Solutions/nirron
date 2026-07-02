import type { ApprovalStatusEnum } from '@/enums'
import type { ListQueryDto } from './common.dto'

export interface ReportListQueryDto extends ListQueryDto {
  status?: ApprovalStatusEnum
  dateFrom?: string
  dateTo?: string
}

export interface ReportListItemDto {
  id: string
  reference: string
  client: string
  status: ApprovalStatusEnum
  divergencesCount: number
  alertsCount: number
  generatedAt: string
  generatedBy: string
}

export interface ReportDetailDto extends ReportListItemDto {
  executiveSummary: string
  aiOpinion: string
  timeline: { id: string; title: string; timestamp: string; type: string }[]
  indicators: { label: string; value: string | number; color?: string }[]
}

export interface ReportExportDto {
  reportId: string
  format: 'pdf' | 'xlsx'
}
