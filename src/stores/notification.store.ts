import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { INotification, NotificationType } from '@/interfaces'

const DEFAULT_TIMEOUT = 5000

export const useNotificationStore = defineStore('notification', () => {
  const items = ref<INotification[]>([])

  function notify (
    type: NotificationType,
    title: string,
    message?: string,
    timeout = DEFAULT_TIMEOUT,
  ): void {
    const notification: INotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timeout,
      closable: true,
    }

    items.value.push(notification)
  }

  function success (title: string, message?: string): void {
    notify('success', title, message)
  }

  function error (title: string, message?: string): void {
    notify('error', title, message, 8000)
  }

  function warning (title: string, message?: string): void {
    notify('warning', title, message, 6000)
  }

  function info (title: string, message?: string): void {
    notify('info', title, message)
  }

  function remove (id: string): void {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clear (): void {
    items.value = []
  }

  return {
    items,
    notify,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
})
