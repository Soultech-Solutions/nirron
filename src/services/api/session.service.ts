import { API_ENDPOINTS } from '@/constants'
import { getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/storage.util'
import { httpClient } from './http.client'

interface DirectusAuthData {
  access_token: string
  refresh_token: string
  expires: number
}

let refreshPromise: Promise<string> | null = null

// Renova o access token uma única vez por vez: requisições 401 simultâneas
// aguardam a mesma promise em vez de disparar múltiplos refreshes.
export function refreshAccessToken (): Promise<string> {
  refreshPromise ??= doRefresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

async function doRefresh (): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Sessão expirada')
  }

  const response = await httpClient.post<{ data: DirectusAuthData }>(
    API_ENDPOINTS.AUTH.REFRESH,
    { refresh_token: refreshToken, mode: 'json' },
    { skipAuth: true },
  )

  const tokens = response.data.data
  setAccessToken(tokens.access_token)
  setRefreshToken(tokens.refresh_token)
  return tokens.access_token
}
