import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'

export function useLoading () {
  const appStore = useAppStore()
  const { globalLoading } = storeToRefs(appStore)

  function startLoading (): void {
    appStore.setGlobalLoading(true)
  }

  function stopLoading (): void {
    appStore.setGlobalLoading(false)
  }

  async function withLoading<T> (fn: () => Promise<T>): Promise<T> {
    startLoading()
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    globalLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
