import type { App } from 'vue'
import { pinia } from '@/stores'

export function registerPinia (app: App): void {
  app.use(pinia)
}
