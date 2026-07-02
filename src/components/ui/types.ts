import type { RouteLocationRaw } from 'vue-router'

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'tonal'
export type AppButtonSize = 'x-small' | 'small' | 'default' | 'large'

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'pending'
  | 'primary'

export type AppChipVariant = 'filled' | 'tonal' | 'outlined' | 'text'
export type AppChipSize = 'x-small' | 'small' | 'default'

export type MetricTrend = 'up' | 'down' | 'stable'

export interface MetricCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: MetricTrend
  trendValue?: string
  color?: string
  loading?: boolean
}

export interface BreadcrumbItem {
  title: string
  to?: RouteLocationRaw
  disabled?: boolean
}

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
}

export interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
  loading?: boolean
}

export interface ToolbarAction {
  label: string
  icon?: string
  onClick?: () => void
  to?: RouteLocationRaw
  variant?: AppButtonVariant
  disabled?: boolean
}

export type SkeletonType = 'card' | 'text' | 'table' | 'avatar' | 'chart'
