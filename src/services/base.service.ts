import { API_ENDPOINTS } from '@/constants'
import type { IBaseService, IRequestConfig } from '@/interfaces'
import type { ListQueryParams, PaginatedResponse } from '@/types'
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from './api/http.client'

export abstract class BaseService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>
implements IBaseService<T, CreateDto, UpdateDto> {
  constructor (protected readonly basePath: string) {}

  async findAll (params?: ListQueryParams): Promise<PaginatedResponse<T>> {
    const response = await apiGet<PaginatedResponse<T>>(this.basePath, {
      params: params as Record<string, unknown>,
    })
    return response.data
  }

  async findById (id: string | number, config?: IRequestConfig): Promise<T> {
    const response = await apiGet<T>(`${this.basePath}/${id}`, config)
    return response.data
  }

  async create (data: CreateDto, config?: IRequestConfig): Promise<T> {
    const response = await apiPost<T>(this.basePath, data, config)
    return response.data
  }

  async update (id: string | number, data: UpdateDto, config?: IRequestConfig): Promise<T> {
    const response = await apiPut<T>(`${this.basePath}/${id}`, data, config)
    return response.data
  }

  async patch (id: string | number, data: UpdateDto, config?: IRequestConfig): Promise<T> {
    const response = await apiPatch<T>(`${this.basePath}/${id}`, data, config)
    return response.data
  }

  async remove (id: string | number, config?: IRequestConfig): Promise<void> {
    await apiDelete<void>(`${this.basePath}/${id}`, config)
  }
}

export { API_ENDPOINTS }
