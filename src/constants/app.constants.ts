export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'NIRRON'

export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '0.1.0'

export const APP_DESCRIPTION =
  'Plataforma de inteligência artificial para conferência pré-registro de DI e DUIMP — operação logística eficiente e segura.'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'nirron_access_token',
  REFRESH_TOKEN: 'nirron_refresh_token',
  USER: 'nirron_user',
  THEME: 'nirron_theme',
  LOCALE: 'nirron_locale',
} as const

export const DEFAULT_LOCALE = 'pt-BR'

export const DEFAULT_PAGE_SIZE = 20

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
