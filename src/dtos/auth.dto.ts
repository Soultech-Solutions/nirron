export interface LoginRequestDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export interface RefreshTokenRequestDto {
  refreshToken: string
}

export interface ForgotPasswordRequestDto {
  email: string
}

export interface ResetPasswordRequestDto {
  token: string
  password: string
  passwordConfirmation: string
}

export interface ForgotPasswordResponseDto {
  message: string
}

export interface ResetPasswordResponseDto {
  message: string
}
