import type { ListQueryDto } from '@/dtos'
import type { IRequestConfig } from '@/interfaces'
import type { ListQueryParams, PaginatedResponse } from '@/types'
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from '@/services/api/http.client'

export abstract class BaseRepository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  constructor (protected readonly basePath: string) {}

  protected mapQuery (query?: ListQueryDto): ListQueryParams {
    if (!query) return {}
    return {
      page: query.page,
      perPage: query.perPage,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      search: query.search,
      filters: query.filters,
    }
  }

  async findAll (query?: ListQueryDto, config?: IRequestConfig): Promise<PaginatedResponse<T>> {
    const response = await apiGet<PaginatedResponse<T>>(this.basePath, {
      ...config,
      params: this.mapQuery(query) as Record<string, unknown>,
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
