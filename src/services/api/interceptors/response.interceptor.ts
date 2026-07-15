import type { ApiErrorResponse } from '@/types'
import type { AxiosError, AxiosResponse } from 'axios'
import { HTTP_STATUS } from '@/constants'
import { clearAuthStorage } from '@/utils'
import { httpClient } from '../http.client'
import { refreshAccessToken } from '../session.service'

type ResponseErrorHandler = (error: AxiosError<ApiErrorResponse>) => Promise<unknown>

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler (handler: () => void): void {
  onUnauthorized = handler
}

export function setupResponseInterceptor (): {
  onFulfilled: (response: AxiosResponse) => AxiosResponse
  onRejected: ResponseErrorHandler
} {
  return {
    onFulfilled (response: AxiosResponse) {
      return response
    },

    async onRejected (error: AxiosError<ApiErrorResponse>) {
      const config = error.config
      const isUnauthorized = error.response?.status === HTTP_STATUS.UNAUTHORIZED

      // 401 em requisição autenticada: renova o token uma única vez e repete a
      // requisição. Endpoints com skipAuth (login/refresh/reset) não entram
      // aqui — o erro deles é tratado pela própria tela.
      if (isUnauthorized && config && !config.skipAuth) {
        if (!config.retriedAfterRefresh) {
          config.retriedAfterRefresh = true
          try {
            const token = await refreshAccessToken()
            config.headers.Authorization = `Bearer ${token}`
            return httpClient.request(config)
          } catch {
            // Refresh falhou: a sessão realmente expirou.
          }
        }
        clearAuthStorage()
        onUnauthorized?.()
      }

      throw error
    },
  }
}
