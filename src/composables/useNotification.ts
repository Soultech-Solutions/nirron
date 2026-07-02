import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores'

export function useNotification () {
  const notificationStore = useNotificationStore()
  const { items } = storeToRefs(notificationStore)

  return {
    items,
    success: notificationStore.success,
    error: notificationStore.error,
    warning: notificationStore.warning,
    info: notificationStore.info,
    remove: notificationStore.remove,
    clear: notificationStore.clear,
  }
}
