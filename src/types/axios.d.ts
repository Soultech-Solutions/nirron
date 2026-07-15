import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandler?: boolean
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandler?: boolean
    retriedAfterRefresh?: boolean
  }
}
