import type { ID, SortOrder, Timestamp } from './common.types'

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
  from: number | null
  to: number | null
}

export interface ListQueryParams extends PaginationParams {
  filters?: Record<string, string | number | boolean | undefined>
}

export interface EntityBase {
  id: ID
  createdAt: Timestamp
  updatedAt: Timestamp
}
