import { API_ENDPOINTS } from '@/constants'
import type {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@/dtos'
import type { IUser } from '@/interfaces'
import { apiGet, apiPost } from '@/services/api/http.client'

class AuthRepository {
  async login (data: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await apiPost<LoginResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
      { skipAuth: true },
    )
    return response.data
  }

  async logout (): Promise<void> {
    await apiPost<void>(API_ENDPOINTS.AUTH.LOGOUT)
  }

  async me (): Promise<IUser> {
    const response = await apiGet<IUser>(API_ENDPOINTS.AUTH.ME)
    return response.data
  }

  async refresh (data: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const response = await apiPost<LoginResponseDto>(
      API_ENDPOINTS.AUTH.REFRESH,
      data,
      { skipAuth: true },
    )
    return response.data
  }

  async forgotPassword (data: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    const response = await apiPost<ForgotPasswordResponseDto>(
      '/auth/forgot-password',
      data,
      { skipAuth: true },
    )
    return response.data
  }

  async resetPassword (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const response = await apiPost<ResetPasswordResponseDto>(
      '/auth/reset-password',
      data,
      { skipAuth: true },
    )
    return response.data
  }
}

export const authRepository = new AuthRepository()
