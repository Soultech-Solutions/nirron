import { API_ENDPOINTS } from '@/constants'
import type { ReportDetailDto, ReportExportDto, ReportListItemDto, ReportListQueryDto } from '@/dtos'
import type { PaginatedResponse } from '@/types'
import { apiPost } from '@/services/api/http.client'
import { BaseRepository } from './base.repository'

class ReportsRepository extends BaseRepository<ReportListItemDto> {
  constructor () {
    super(API_ENDPOINTS.REPORTS.BASE)
  }

  async list (query?: ReportListQueryDto): Promise<PaginatedResponse<ReportListItemDto>> {
    return this.findAll(query)
  }

  async getDetail (id: string): Promise<ReportDetailDto> {
    return this.findById(id) as Promise<ReportDetailDto>
  }

  async exportPdf (data: ReportExportDto): Promise<Blob> {
    const response = await apiPost<{ url: string }>(`${this.basePath}/${data.reportId}/export`, data)
    return new Blob([JSON.stringify(response.data)], { type: 'application/pdf' })
  }
}

export const reportsRepository = new ReportsRepository()
