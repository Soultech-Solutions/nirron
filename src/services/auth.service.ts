import type {
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@/dtos'
import type { IUser } from '@/interfaces'
import { authRepository } from '@/repositories'
import { getRefreshToken } from '@/utils'

export const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

interface IAuthService {
  login: (data: LoginRequestDto) => Promise<LoginResponseDto>
  logout: () => Promise<void>
  me: () => Promise<IUser>
  refresh: (data: RefreshTokenRequestDto) => Promise<LoginResponseDto>
  forgotPassword: (email: string) => Promise<ForgotPasswordResponseDto>
  resetPassword: (data: ResetPasswordRequestDto) => Promise<ResetPasswordResponseDto>
}

class DirectusAuthService implements IAuthService {
  async login (data: LoginRequestDto): Promise<LoginResponseDto> {
    return authRepository.login(data)
  }

  async logout (): Promise<void> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return
    }
    try {
      await authRepository.logout(refreshToken)
    } catch {
      // Logout no servidor é melhor esforço: a sessão local é limpa pelo store.
    }
  }

  async me (): Promise<IUser> {
    return authRepository.me()
  }

  async refresh (data: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    return authRepository.refresh(data)
  }

  async forgotPassword (email: string): Promise<ForgotPasswordResponseDto> {
    return authRepository.forgotPassword({ email })
  }

  async resetPassword (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    return authRepository.resetPassword(data)
  }
}

class MockAuthService implements IAuthService {
  async login (data: LoginRequestDto): Promise<LoginResponseDto> {
    const { mockLogin } = await import('@/mocks/auth.mock')
    await delay(600)
    return mockLogin(data.email, data.password)
  }

  async logout (): Promise<void> {
    await delay(200)
  }

  async me (): Promise<IUser> {
    const { DEMO_USER } = await import('@/mocks/auth.mock')
    await delay(300)
    return DEMO_USER
  }

  async refresh (data: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const { mockRefreshToken } = await import('@/mocks/auth.mock')
    await delay(300)
    return mockRefreshToken(data.refreshToken)
  }

  async forgotPassword (email: string): Promise<ForgotPasswordResponseDto> {
    const { mockForgotPassword } = await import('@/mocks/auth.mock')
    await delay(500)
    void email
    return mockForgotPassword()
  }

  async resetPassword (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const { mockResetPassword } = await import('@/mocks/auth.mock')
    await delay(500)
    void data
    return mockResetPassword()
  }
}

function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const authService: IAuthService = USE_MOCK_AUTH
  ? new MockAuthService()
  : new DirectusAuthService()
