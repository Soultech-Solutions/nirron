import { ref } from 'vue'
import type { ApiResponse } from '@/types'
import { getErrorMessage, parseApiError } from '@/utils'
import { useNotificationStore } from '@/stores'

export function useApi () {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notificationStore = useNotificationStore()

  async function execute<T> (
    request: () => Promise<ApiResponse<T>>,
    options?: {
      successMessage?: string
      errorMessage?: string
      showError?: boolean
      showSuccess?: boolean
    },
  ): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const response = await request()

      if (options?.showSuccess && options.successMessage) {
        notificationStore.success(options.successMessage)
      }

      return response.data
    } catch (err) {
      const message = getErrorMessage(err, options?.errorMessage)
      error.value = message

      if (options?.showError !== false) {
        notificationStore.error('Erro na requisição', message)
      }

      throw parseApiError(err)
    } finally {
      loading.value = false
    }
  }

  function resetError (): void {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    resetError,
  }
}
