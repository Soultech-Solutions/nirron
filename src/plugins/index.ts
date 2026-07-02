import type { App } from 'vue'
import vuetify from './vuetify'
import { registerPinia } from './pinia'
import { registerRouter } from './router'

export function registerPlugins (app: App): void {
  registerPinia(app)
  registerRouter(app)
  app.use(vuetify)
}
