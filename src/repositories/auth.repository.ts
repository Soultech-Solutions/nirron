import type {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@/dtos'
import type { IRequestConfig, IUser, UserRole } from '@/interfaces'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants'
import { apiGet, apiPost } from '@/services/api/http.client'
import { isForbiddenError } from '@/utils'

// Formato de resposta dos endpoints de autenticação do Directus (snake_case).
interface DirectusAuthData {
  access_token: string
  refresh_token: string
  expires: number // em milissegundos
}

interface DirectusUser {
  id: string
  first_name?: string | null
  last_name?: string | null
  email: string
  avatar?: string | null
  status?: string | null
  role?: { name?: string | null } | string | null
}

const ME_FIELDS = 'id,first_name,last_name,email,avatar,status,role.name'
// Roles sem permissão de leitura em directus_roles não podem expandir role.name.
const ME_FIELDS_WITHOUT_ROLE = 'id,first_name,last_name,email,avatar,status'

function mapRole (role: DirectusUser['role']): UserRole {
  const name = typeof role === 'object' && role !== null ? (role.name ?? '') : ''
  const normalized = name.toLowerCase()
  if (normalized.includes('admin')) {
    return 'admin'
  }
  if (normalized.includes('supervisor')) {
    return 'supervisor'
  }
  if (normalized.includes('analyst') || normalized.includes('analista')) {
    return 'analyst'
  }
  return 'viewer'
}

function mapDirectusUser (user: DirectusUser): IUser {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email
  const now = new Date().toISOString()
  return {
    id: user.id,
    name,
    email: user.email,
    role: mapRole(user.role),
    avatar: user.avatar ? `${API_BASE_URL}/assets/${user.avatar}` : undefined,
    active: (user.status ?? 'active') === 'active',
    createdAt: now,
    updatedAt: now,
  }
}

class AuthRepository {
  async login (data: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await apiPost<DirectusAuthData>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email: data.email, password: data.password, mode: 'json' },
      { skipAuth: true },
    )
    return this.buildSession(response.data)
  }

  async logout (refreshToken: string): Promise<void> {
    await apiPost<void>(
      API_ENDPOINTS.AUTH.LOGOUT,
      { refresh_token: refreshToken, mode: 'json' },
      { skipAuth: true },
    )
  }

  async me (config?: IRequestConfig): Promise<IUser> {
    try {
      const response = await apiGet<DirectusUser>(API_ENDPOINTS.AUTH.ME, {
        ...config,
        params: { fields: ME_FIELDS },
      })
      return mapDirectusUser(response.data)
    } catch (error) {
      if (!isForbiddenError(error)) {
        throw error
      }
      const response = await apiGet<DirectusUser>(API_ENDPOINTS.AUTH.ME, {
        ...config,
        params: { fields: ME_FIELDS_WITHOUT_ROLE },
      })
      return mapDirectusUser(response.data)
    }
  }

  async refresh (data: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const response = await apiPost<DirectusAuthData>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: data.refreshToken, mode: 'json' },
      { skipAuth: true },
    )
    return this.buildSession(response.data)
  }

  async forgotPassword (data: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    await apiPost<void>(
      API_ENDPOINTS.AUTH.PASSWORD_REQUEST,
      { email: data.email },
      { skipAuth: true },
    )
    return { message: 'Se o e-mail existir, você receberá instruções para redefinir sua senha.' }
  }

  async resetPassword (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    await apiPost<void>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET,
      { token: data.token, password: data.password },
      { skipAuth: true },
    )
    return { message: 'Senha redefinida com sucesso. Faça login com sua nova senha.' }
  }

  // O login/refresh do Directus retorna apenas tokens; o usuário é buscado com o
  // token recém-emitido (passado explicitamente, pois ainda não foi persistido).
  private async buildSession (tokens: DirectusAuthData): Promise<LoginResponseDto> {
    const user = await this.me({
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: Math.floor(tokens.expires / 1000),
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }
  }
}

export const authRepository = new AuthRepository()
