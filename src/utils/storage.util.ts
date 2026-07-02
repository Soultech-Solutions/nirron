import { STORAGE_KEYS } from '@/constants'

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const storage = {
  get<T>(key: StorageKey): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  set<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: StorageKey): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  },
}

export function getAccessToken (): string | null {
  return storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
}

export function setAccessToken (token: string): void {
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token)
}

export function getRefreshToken (): string | null {
  return storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN)
}

export function setRefreshToken (token: string): void {
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, token)
}

export function clearAuthStorage (): void {
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
  storage.remove(STORAGE_KEYS.USER)
}
