import type { Pinia } from 'pinia'
import { createPinia } from 'pinia'

export const pinia: Pinia = createPinia()

export { useAppStore } from './app.store'
export { useAuthStore } from './auth.store'
export { useNotificationStore } from './notification.store'
