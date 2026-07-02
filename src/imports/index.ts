import { API_ENDPOINTS } from '@/constants'
import { BaseService } from '@/services'
import type { ImportOperation } from './types'

class ImportsService extends BaseService<ImportOperation> {
  constructor () {
    super(API_ENDPOINTS.IMPORTS.BASE)
  }
}

export const importsService = new ImportsService()

export { useImportsList, useImportDetail } from './composables/useImports'
export * from './types'
export * from './constants'
