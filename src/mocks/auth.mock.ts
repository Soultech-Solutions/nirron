import type { LoginResponseDto } from '@/dtos'
import type { IUser } from '@/interfaces'

export const DEMO_CREDENTIALS = {
  email: 'admin@nirron.com',
  password: 'admin123',
} as const

const DEMO_USER: IUser = {
  id: '1',
  name: 'Administrador',
  email: DEMO_CREDENTIALS.email,
  role: 'admin',
  active: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

export function mockLogin (email: string, password: string): LoginResponseDto {
  if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
    throw new Error('Credenciais inválidas. Use admin@nirron.com / admin123')
  }

  return {
    accessToken: `mock_access_${Date.now()}`,
    refreshToken: `mock_refresh_${Date.now()}`,
    expiresIn: 3600,
    user: {
      id: String(DEMO_USER.id),
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      role: DEMO_USER.role,
    },
  }
}

export function mockRefreshToken (refreshToken: string): LoginResponseDto {
  if (!refreshToken.startsWith('mock_refresh_')) {
    throw new Error('Refresh token inválido')
  }
  return mockLogin(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)
}

export function mockForgotPassword (): { message: string } {
  return { message: 'Se o e-mail existir, você receberá instruções para redefinir sua senha.' }
}

export function mockResetPassword (): { message: string } {
  return { message: 'Senha redefinida com sucesso. Faça login com sua nova senha.' }
}

export { DEMO_USER }
