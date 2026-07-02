import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/constants'
import type { ApiResponse } from '@/types'
import type { IRequestConfig } from '@/interfaces'
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from './interceptors'

export type HttpClient = AxiosInstance

function mapRequestConfig (config?: IRequestConfig): AxiosRequestConfig {
  if (!config) return {}

  return {
    params: config.params,
    headers: config.headers,
    skipAuth: config.skipAuth,
    skipErrorHandler: config.skipErrorHandler,
  } as AxiosRequestConfig
}

function createHttpClient (): HttpClient {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const requestInterceptor = setupRequestInterceptor()
  const responseInterceptor = setupResponseInterceptor()

  instance.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected,
  )

  instance.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected,
  )

  return instance
}

export const httpClient = createHttpClient()

export async function apiGet<T> (
  url: string,
  config?: IRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await httpClient.get<ApiResponse<T>>(url, mapRequestConfig(config))
  return response.data
}

export async function apiPost<T> (
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await httpClient.post<ApiResponse<T>>(url, data, mapRequestConfig(config))
  return response.data
}

export async function apiPut<T> (
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await httpClient.put<ApiResponse<T>>(url, data, mapRequestConfig(config))
  return response.data
}

export async function apiPatch<T> (
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await httpClient.patch<ApiResponse<T>>(url, data, mapRequestConfig(config))
  return response.data
}

export async function apiDelete<T> (
  url: string,
  config?: IRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await httpClient.delete<ApiResponse<T>>(url, mapRequestConfig(config))
  return response.data
}
