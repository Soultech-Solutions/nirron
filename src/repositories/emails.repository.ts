import { API_ENDPOINTS } from '@/constants'
import { httpClient } from '@/services/api/http.client'
import { isAxiosError } from 'axios'
import { AppError, parseApiError } from '@/utils'

export interface ReprocessEmailResponse {
  ok: boolean
  email_id: string
  status: string
  message: string
}

const REPROCESS_MESSAGE
  = 'Reprocessamento enfileirado. O miner irá reprocessar no próximo ciclo.'

/**
 * Enfileira re-extração marcando o e-mail como `pending` no Directus.
 *
 * O POST /api/emails/{id}/reprocess documentado vive no dashboard
 * (ex. soultech.solutions:8081), não no Directus em mailminer.soultech.solutions.
 * Este app autentica via Bearer Directus, então aplica o mesmo side effect
 * que a web API: PATCH emails.status = pending (o miner processa no próximo ciclo).
 */
class EmailsRepository {
  async reprocess (emailId: string): Promise<ReprocessEmailResponse> {
    try {
      await httpClient.patch(
        API_ENDPOINTS.DIRECTUS.EMAIL_BY_ID(emailId),
        { status: 'pending' },
      )
    } catch (error) {
      const parsed = parseApiError(error)
      if (parsed.statusCode === 404) {
        throw new AppError('Email não encontrado.', undefined, 404)
      }
      if (parsed.statusCode === 403) {
        throw new AppError(
          'Sem permissão para atualizar o e-mail. Verifique o acesso à collection emails no Directus.',
          undefined,
          403,
        )
      }
      // Directus às vezes devolve 400 com mensagem genérica
      if (isAxiosError(error) && error.response?.status === 400) {
        throw new AppError(
          parsed.message || 'Não foi possível enfileirar o reprocessamento.',
          parsed.code,
          400,
        )
      }
      throw parsed
    }

    return {
      ok: true,
      email_id: emailId,
      status: 'pending',
      message: REPROCESS_MESSAGE,
    }
  }
}

export const emailsRepository = new EmailsRepository()
