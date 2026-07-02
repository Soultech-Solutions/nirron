import { API_ENDPOINTS } from '@/constants'
import type { ImportDetailDto, ImportExportDto, ImportListItemDto, ImportListQueryDto } from '@/dtos'
import type { PaginatedResponse } from '@/types'
import { apiPost } from '@/services/api/http.client'
import { BaseRepository } from './base.repository'

class ImportsRepository extends BaseRepository<ImportListItemDto> {
  constructor () {
    super(API_ENDPOINTS.IMPORTS.BASE)
  }

  async list (query?: ImportListQueryDto): Promise<PaginatedResponse<ImportListItemDto>> {
    return this.findAll(query)
  }

  async getDetail (id: string): Promise<ImportDetailDto> {
    return this.findById(id) as Promise<ImportDetailDto>
  }

  async export (data: ImportExportDto): Promise<Blob> {
    const response = await apiPost<{ url: string }>(`${this.basePath}/export`, data)
    // Em produção: download via URL ou blob
    return new Blob([JSON.stringify(response.data)], { type: 'application/json' })
  }
}

export const importsRepository = new ImportsRepository()
