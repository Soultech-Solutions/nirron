export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface INotification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timeout?: number
  closable?: boolean
}

export interface INotificationState {
  items: INotification[]
}

export interface INotificationService {
  success(title: string, message?: string): void
  error(title: string, message?: string): void
  warning(title: string, message?: string): void
  info(title: string, message?: string): void
  remove(id: string): void
  clear(): void
}
