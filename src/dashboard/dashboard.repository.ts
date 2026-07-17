import { API_ENDPOINTS } from '@/constants'
import type { ImportListItemDto } from '@/dtos'
import {
  type DirectusProcess,
  mapProcessToListItem,
  PROCESS_LIST_FIELDS,
} from '@/repositories/processes.repository'
import { directusList } from '@/services/api/directus.items'
import {
  runConferenceAnalysis,
  type ConferenceAnalysis,
} from '@/validation/conference.engine'

export interface DashboardProcessSnapshot {
  process: DirectusProcess
  item: ImportListItemDto
  analysis: ConferenceAnalysis
}

const BASIC_FIELDS = [
  'id',
  'ref_nirron',
  'ref_cliente',
  'template_name',
  'body_fields',
  'confidence',
].join(',')

class DashboardRepository {
  async getProcessSnapshots (): Promise<DashboardProcessSnapshot[]> {
    let processes: DirectusProcess[]

    try {
      const response = await directusList<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESSES,
        {
          page: 1,
          limit: 1000,
          sort: '-id',
          fields: PROCESS_LIST_FIELDS,
        },
      )
      processes = response.data
    } catch {
      // Mantém a dashboard disponível quando a relação documents não é permitida.
      const response = await directusList<DirectusProcess>(
        API_ENDPOINTS.DIRECTUS.PROCESSES,
        {
          page: 1,
          limit: 1000,
          sort: '-id',
          fields: BASIC_FIELDS,
        },
      )
      processes = response.data
    }

    return processes.map((process) => ({
      process,
      item: mapProcessToListItem(process),
      analysis: runConferenceAnalysis(process),
    }))
  }
}

export const dashboardRepository = new DashboardRepository()
