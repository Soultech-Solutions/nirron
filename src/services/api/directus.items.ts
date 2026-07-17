import type { IRequestConfig } from '@/interfaces'
import type { PaginatedResponse } from '@/types'
import { apiGet } from '@/services/api/http.client'

/** Resposta listagem Directus (`/items/...`) */
export interface DirectusListResponse<T> {
  data: T[]
  meta?: {
    filter_count?: number
    total_count?: number
  }
}

export interface DirectusListParams {
  page?: number
  limit?: number
  search?: string
  sort?: string | string[]
  fields?: string | string[]
  filter?: Record<string, unknown>
  meta?: string
}

function toQueryParams (params: DirectusListParams): Record<string, unknown> {
  const query: Record<string, unknown> = {
    meta: params.meta ?? 'filter_count',
  }

  if (params.page !== undefined) query.page = params.page
  if (params.limit !== undefined) query.limit = params.limit
  if (params.search) query.search = params.search
  if (params.sort) query.sort = params.sort
  if (params.fields) {
    query.fields = Array.isArray(params.fields) ? params.fields.join(',') : params.fields
  }
  if (params.filter) {
    query.filter = JSON.stringify(params.filter)
  }

  return query
}

/**
 * Lista itens de uma collection Directus e normaliza para PaginatedResponse.
 * Directus: GET /items/{collection}?limit=&page=&meta=filter_count
 */
export async function directusList<T> (
  path: string,
  params: DirectusListParams = {},
  config?: IRequestConfig,
): Promise<PaginatedResponse<T>> {
  const page = params.page ?? 1
  const limit = params.limit ?? 20

  const response = await apiGet<T[]>(path, {
    ...config,
    params: toQueryParams({ ...params, page, limit }),
  })

  // apiGet tipa ApiResponse<T>, mas a resposta Directus traz data[] + meta no mesmo nível.
  const body = response as unknown as DirectusListResponse<T>
  const data = Array.isArray(body.data) ? body.data : []
  const total = body.meta?.filter_count ?? body.meta?.total_count ?? data.length
  const lastPage = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? null : (page - 1) * limit + 1
  const to = total === 0 ? null : Math.min(page * limit, total)

  return {
    data,
    meta: {
      currentPage: page,
      perPage: limit,
      total,
      lastPage,
      from,
      to,
    },
  }
}

export async function directusGetById<T> (
  path: string,
  config?: IRequestConfig,
): Promise<T> {
  const response = await apiGet<T>(path, config)
  return response.data
}
