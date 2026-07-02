import type { AxiosError, AxiosResponse } from 'axios'
import { HTTP_STATUS } from '@/constants'
import type { ApiErrorResponse } from '@/types'
import { clearAuthStorage } from '@/utils'

type ResponseErrorHandler = (error: AxiosError<ApiErrorResponse>) => Promise<never>

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
      const skipErrorHandler = error.config?.skipErrorHandler

      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        clearAuthStorage()
        onUnauthorized?.()
      }

      if (!skipErrorHandler) {
        // O tratamento visual de erro é delegado aos composables/stores
      }

      return Promise.reject(error)
    },
  }
}
