import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants'
import type { IAuthSession, ILoginCredentials, IUser } from '@/interfaces'
import type { ResetPasswordRequestDto } from '@/dtos'
import { authService } from '@/services'
import { DEMO_USER } from '@/mocks/auth.mock'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  storage,
} from '@/utils'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(storage.get<IUser>(STORAGE_KEYS.USER))
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value && getAccessToken()))

  async function login (credentials: ILoginCredentials): Promise<void> {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      persistSession(mapResponseToSession(response))
    } finally {
      loading.value = false
    }
  }

  async function logout (): Promise<void> {
    loading.value = true
    try {
      if (isAuthenticated.value) {
        await authService.logout()
      }
    } finally {
      clearSession()
      loading.value = false
    }
  }

  async function fetchMe (): Promise<void> {
    if (!getAccessToken()) return
    loading.value = true
    try {
      const currentUser = await authService.me()
      user.value = currentUser
      storage.set(STORAGE_KEYS.USER, currentUser)
    } catch {
      clearSession()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function refreshSession (): Promise<boolean> {
    const token = getRefreshToken()
    if (!token) return false
    try {
      const response = await authService.refresh({ refreshToken: token })
      persistSession(mapResponseToSession(response))
      return true
    } catch {
      clearSession()
      return false
    }
  }

  async function forgotPassword (email: string): Promise<void> {
    loading.value = true
    try {
      await authService.forgotPassword(email)
    } finally {
      loading.value = false
    }
  }

  async function resetPassword (data: ResetPasswordRequestDto): Promise<void> {
    loading.value = true
    try {
      await authService.resetPassword()
      void data
    } finally {
      loading.value = false
    }
  }

  async function initialize (): Promise<void> {
    if (getAccessToken() && !user.value) {
      user.value = DEMO_USER
      storage.set(STORAGE_KEYS.USER, DEMO_USER)
    }
    initialized.value = true
  }

  function mapResponseToSession (response: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: { id: string; name: string; email: string; role: string; avatar?: string }
  }): IAuthSession {
    return {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as IUser['role'],
        avatar: response.user.avatar,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      },
    }
  }

  function persistSession (session: IAuthSession): void {
    user.value = session.user
    setAccessToken(session.tokens.accessToken)
    setRefreshToken(session.tokens.refreshToken)
    storage.set(STORAGE_KEYS.USER, session.user)
  }

  function clearSession (): void {
    user.value = null
    clearAuthStorage()
  }

  function hasRole (...roles: IUser['role'][]): boolean {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    login,
    logout,
    fetchMe,
    refreshSession,
    forgotPassword,
    resetPassword,
    initialize,
    persistSession,
    clearSession,
    hasRole,
    getRefreshToken,
  }
})
