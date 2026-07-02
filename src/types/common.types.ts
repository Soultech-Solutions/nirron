export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ID = string | number

export type Timestamp = string

export type SortOrder = 'asc' | 'desc'

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface KeyValuePair<T = string> {
  key: string
  value: T
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = unknown> {
  data: T | null
  loading: boolean
  error: string | null
}
