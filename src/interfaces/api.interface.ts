import type { ApiErrorResponse, ApiResponse, PaginatedResponse } from '@/types'

export interface IApiClient {
  get<T>(url: string, config?: IRequestConfig): Promise<ApiResponse<T>>
  post<T>(url: string, data?: unknown, config?: IRequestConfig): Promise<ApiResponse<T>>
  put<T>(url: string, data?: unknown, config?: IRequestConfig): Promise<ApiResponse<T>>
  patch<T>(url: string, data?: unknown, config?: IRequestConfig): Promise<ApiResponse<T>>
  delete<T>(url: string, config?: IRequestConfig): Promise<ApiResponse<T>>
}

export interface IRequestConfig {
  params?: Record<string, unknown>
  headers?: Record<string, string>
  skipAuth?: boolean
  skipErrorHandler?: boolean
}

export interface IBaseService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  findAll(params?: Record<string, unknown>): Promise<PaginatedResponse<T>>
  findById(id: string | number): Promise<T>
  create(data: CreateDto): Promise<T>
  update(id: string | number, data: UpdateDto): Promise<T>
  remove(id: string | number): Promise<void>
}

export type { ApiErrorResponse, ApiResponse, PaginatedResponse }
