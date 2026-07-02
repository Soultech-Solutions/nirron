import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    description?: string
    requiresAuth?: boolean
    roles?: Array<'admin' | 'supervisor' | 'analyst' | 'viewer'>
    nav?: boolean
    order?: number
    layout?: 'default' | 'auth' | 'blank'
  }
}

export interface AppRouteMeta {
  title?: string
  icon?: string
  requiresAuth?: boolean
  roles?: Array<'admin' | 'supervisor' | 'analyst' | 'viewer'>
  nav?: boolean
  order?: number
  layout?: 'default' | 'auth' | 'blank'
}
