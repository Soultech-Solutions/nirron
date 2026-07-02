import type { ID, Timestamp } from '@/types'

export interface IUser {
  id: ID
  name: string
  email: string
  role: UserRole
  avatar?: string
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type UserRole = 'admin' | 'supervisor' | 'analyst' | 'viewer'

export interface IAuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IAuthSession {
  user: IUser
  tokens: IAuthTokens
}

export interface IAuthState {
  user: IUser | null
  isAuthenticated: boolean
  loading: boolean
}
