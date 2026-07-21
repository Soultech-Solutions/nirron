import type { ApiErrorResponse } from '@/types'
import { isAxiosError } from 'axios'

export class AppError extends Error {
  constructor (
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// O Directus responde erros como { errors: [{ message, extensions: { code } }] }.
interface DirectusErrorItem {
  message?: string
  extensions?: { code?: string }
}

const DIRECTUS_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  INVALID_TOKEN: 'Sessão inválida ou expirada.',
  TOKEN_EXPIRED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
}

function parseDirectusError (
  data: unknown,
): { message: string, code?: string } | null {
  if (!data || typeof data !== 'object' || !('errors' in data)) {
    return null
  }
  const errors = (data as { errors: unknown }).errors
  if (!Array.isArray(errors) || errors.length === 0) {
    return null
  }
  const first = errors[0] as DirectusErrorItem
  if (typeof first?.message !== 'string') {
    return null
  }
  return { message: first.message, code: first.extensions?.code }
}

export function parseApiError (error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (isAxiosError<ApiErrorResponse>(error)) {
    const axiosError = error
    const response = axiosError.response?.data
    const statusCode = axiosError.response?.status
    const directusError = parseDirectusError(response)

    if (directusError) {
      return new AppError(
        DIRECTUS_ERROR_MESSAGES[directusError.code ?? ''] ?? directusError.message,
        directusError.code,
        statusCode,
      )
    }

    const webApiError
      = response
        && typeof response === 'object'
        && 'error' in response
        && typeof (response as { error: unknown }).error === 'string'
        ? (response as { error: string }).error
        : undefined

    return new AppError(
      webApiError
        ?? response?.message
        ?? axiosError.message
        ?? 'Erro inesperado na requisição',
      response?.code,
      statusCode ?? response?.statusCode,
      response?.errors,
    )
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError('Erro desconhecido')
}

export function getErrorMessage (error: unknown, fallback = 'Ocorreu um erro inesperado'): string {
  return parseApiError(error).message || fallback
}

export function isUnauthorizedError (error: unknown): boolean {
  return parseApiError(error).statusCode === 401
}

export function isForbiddenError (error: unknown): boolean {
  return parseApiError(error).statusCode === 403
}

export function isNotFoundError (error: unknown): boolean {
  return parseApiError(error).statusCode === 404
}

export function isValidationError (error: unknown): boolean {
  return parseApiError(error).statusCode === 422
}
