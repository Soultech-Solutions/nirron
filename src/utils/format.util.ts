import { DEFAULT_LOCALE } from '@/constants'

export function formatCurrency (
  value: number,
  currency = 'BRL',
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatNumber (
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatDate (
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale = DEFAULT_LOCALE,
): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime (
  value: string | Date,
  locale = DEFAULT_LOCALE,
): string {
  return formatDate(value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }, locale)
}

export function formatCnpj (value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  )
}

export function formatNcm (value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 8) return value
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`
}

export function truncate (text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}
