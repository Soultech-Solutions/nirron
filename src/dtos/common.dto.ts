import type { SortOrderEnum } from '@/enums'

export interface PaginationQueryDto {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: SortOrderEnum
  search?: string
}

export interface FilterQueryDto {
  filters?: Record<string, string | number | boolean | undefined>
}

export interface ListQueryDto extends PaginationQueryDto, FilterQueryDto {}

export interface ExportQueryDto extends FilterQueryDto {
  format: 'pdf' | 'xlsx' | 'csv'
  columns?: string[]
}

export interface UploadResponseDto {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  uploadedAt: string
}

export interface DownloadRequestDto {
  fileId: string
  fileName?: string
}
