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

export function parseApiError (error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (isAxiosError<ApiErrorResponse>(error)) {
    const axiosError = error
    const response = axiosError.response?.data
    const statusCode = axiosError.response?.status

    return new AppError(
      response?.message ?? axiosError.message ?? 'Erro inesperado na requisição',
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
