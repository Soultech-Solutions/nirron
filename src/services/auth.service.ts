import type { LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto } from '@/dtos'
import type { IUser } from '@/interfaces'
import { mockForgotPassword, mockLogin, mockRefreshToken, mockResetPassword, DEMO_USER } from '@/mocks/auth.mock'

class AuthService {
  async login (data: LoginRequestDto): Promise<LoginResponseDto> {
    await delay(600)
    return mockLogin(data.email, data.password)
  }

  async logout (): Promise<void> {
    await delay(200)
  }

  async me (): Promise<IUser> {
    await delay(300)
    return DEMO_USER
  }

  async refresh (data: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    await delay(300)
    return mockRefreshToken(data.refreshToken)
  }

  async forgotPassword (email: string): Promise<{ message: string }> {
    await delay(500)
    void email
    return mockForgotPassword()
  }

  async resetPassword (): Promise<{ message: string }> {
    await delay(500)
    return mockResetPassword()
  }
}

function delay (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const authService = new AuthService()
