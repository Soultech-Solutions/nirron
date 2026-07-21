import { computed, ref } from 'vue'
import type {
  AIResultData,
  ComparisonField,
  DocumentItem,
  RiskItem,
  TimelineEvent,
  ValidationCardData,
  WorkflowStep,
} from '@/components/domain/types'
import type { ImportDetailDto, ImportListItemDto, ImportListQueryDto } from '@/dtos'
import type { PaginatedResponse } from '@/types'
import { OperationStatus, SortOrderEnum } from '@/enums'
import {
  getImportDetail,
  mockAIResult,
  mockComparisonFields,
  mockDocuments,
  mockRisks,
  mockTimeline,
  mockValidationCards,
  mockWorkflowSteps,
  mockImportsList,
} from '@/mocks/imports.mock'
import { OPERATION_STATUS_LABELS } from '@/imports/processStatus'
import { processesRepository } from '@/repositories/processes.repository'
import { emailsRepository } from '@/repositories/emails.repository'
import { USE_MOCK_AUTH } from '@/services'
import { getErrorMessage } from '@/utils'

export function useImportsList () {
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)
  const items = ref<ImportListItemDto[]>([])
  const meta = ref<PaginatedResponse<ImportListItemDto>['meta']>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    from: null,
    to: null,
  })

  const query = ref<ImportListQueryDto>({
    page: 1,
    perPage: 10,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: SortOrderEnum.DESC,
  })

  const selectedIds = ref<string[]>([])
  const drawerOpen = ref(false)
  const drawerItem = ref<ImportListItemDto | null>(null)

  const statusOptions = computed(() => [
    { label: 'Todos', value: '' },
    { label: 'Pendente', value: OperationStatus.PENDING },
    { label: 'Em conferência', value: OperationStatus.IN_CONFERENCE },
    { label: 'Em revisão', value: OperationStatus.IN_REVIEW },
    { label: 'Concluída', value: OperationStatus.COMPLETED },
    { label: 'Aprovada', value: OperationStatus.APPROVED },
    { label: 'Bloqueada', value: OperationStatus.BLOCKED },
  ])

  async function fetchList (): Promise<void> {
    loading.value = true
    errorMessage.value = null
    try {
      if (USE_MOCK_AUTH) {
        await delay(400)
        const response = mockImportsList({
          page: query.value.page,
          perPage: query.value.perPage,
          search: query.value.search,
          status: query.value.status,
          sortBy: query.value.sortBy,
          sortOrder: query.value.sortOrder,
        })
        items.value = response.data
        meta.value = response.meta
        return
      }

      const response = await processesRepository.list(query.value)
      let data = response.data
      if (query.value.status) {
        data = data.filter((item) => item.status === query.value.status)
      }
      items.value = data
      meta.value = {
        ...response.meta,
        // Mantém a contagem alinhada quando o filtro de status é aplicado no client
        from: data.length ? 1 : null,
        to: data.length || null,
        total: query.value.status ? data.length : response.meta.total,
        lastPage: query.value.status
          ? Math.max(1, Math.ceil(data.length / (query.value.perPage ?? 10)))
          : response.meta.lastPage,
      }
    } catch (error) {
      errorMessage.value = getErrorMessage(error, 'Falha ao carregar processos do Directus')
      items.value = []
    } finally {
      loading.value = false
    }
  }

  function setSearch (value: string): void {
    query.value.search = value
    query.value.page = 1
    void fetchList()
  }

  function setStatus (status?: string | null): void {
    query.value.status = Object.values(OperationStatus).includes(status as OperationStatus)
      ? status as OperationStatus
      : undefined
    query.value.page = 1
    void fetchList()
  }

  function setPage (page: number): void {
    query.value.page = page
    void fetchList()
  }

  function setSort (sortBy: string): void {
    if (query.value.sortBy === sortBy) {
      query.value.sortOrder = query.value.sortOrder === SortOrderEnum.ASC
        ? SortOrderEnum.DESC
        : SortOrderEnum.ASC
    } else {
      query.value.sortBy = sortBy
      query.value.sortOrder = SortOrderEnum.ASC
    }
    void fetchList()
  }

  function toggleSelect (id: string): void {
    const index = selectedIds.value.indexOf(id)
    if (index >= 0) selectedIds.value.splice(index, 1)
    else selectedIds.value.push(id)
  }

  function toggleSelectAll (): void {
    if (selectedIds.value.length === items.value.length) {
      selectedIds.value = []
    } else {
      selectedIds.value = items.value.map((i) => i.id)
    }
  }

  function openDrawer (item: ImportListItemDto): void {
    drawerItem.value = item
    drawerOpen.value = true
  }

  function closeDrawer (): void {
    drawerOpen.value = false
  }

  async function exportSelected (): Promise<void> {
    await delay(300)
  }

  async function reprocessEmail (emailId: string): Promise<string> {
    if (USE_MOCK_AUTH) {
      await delay(400)
      return 'Reprocessamento enfileirado (mock).'
    }
    const result = await emailsRepository.reprocess(emailId)
    return result.message
  }

  return {
    loading,
    errorMessage,
    items,
    meta,
    query,
    selectedIds,
    drawerOpen,
    drawerItem,
    statusOptions,
    fetchList,
    setSearch,
    setStatus,
    setPage,
    setSort,
    toggleSelect,
    toggleSelectAll,
    openDrawer,
    closeDrawer,
    exportSelected,
    reprocessEmail,
  }
}

export function useImportDetail () {
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)
  const detail = ref<ImportDetailDto | null>(null)
  const documents = ref<DocumentItem[]>([])
  const workflowSteps = ref<WorkflowStep[]>([])
  const validationCards = ref<ValidationCardData[]>([])
  const comparisonFields = ref<ComparisonField[]>([])
  const mercanteComparisonFields = ref<ComparisonField[]>([])
  const extractedFieldMap = ref<Record<string, string>>({})
  const risks = ref<RiskItem[]>([])
  const timeline = ref<TimelineEvent[]>([])
  const aiResult = ref<AIResultData>({
    summary: '',
    confidence: 0,
    recommendation: '',
    risks: [],
    approved: false,
  })

  async function fetchDetail (id: string): Promise<void> {
    loading.value = true
    errorMessage.value = null
    try {
      if (USE_MOCK_AUTH) {
        await delay(400)
        detail.value = getImportDetail(id) ?? null
        documents.value = mockDocuments
        workflowSteps.value = mockWorkflowSteps
        validationCards.value = mockValidationCards
        comparisonFields.value = mockComparisonFields
        mercanteComparisonFields.value = []
        extractedFieldMap.value = {}
        risks.value = mockRisks
        timeline.value = mockTimeline
        aiResult.value = mockAIResult
        return
      }

      const response = await processesRepository.getDetail(id)
      detail.value = response.detail
      documents.value = response.documents
      workflowSteps.value = response.workflowSteps
      validationCards.value = response.validationCards
      comparisonFields.value = response.comparisonFields
      mercanteComparisonFields.value = []
      extractedFieldMap.value = response.extractedFieldMap
      risks.value = response.risks
      timeline.value = response.timeline
      aiResult.value = response.aiResult
    } catch (error) {
      errorMessage.value = getErrorMessage(error, 'Falha ao carregar processo')
      detail.value = null
      documents.value = []
      workflowSteps.value = []
      validationCards.value = []
      comparisonFields.value = []
      mercanteComparisonFields.value = []
      extractedFieldMap.value = {}
      risks.value = []
      timeline.value = []
      aiResult.value = {
        summary: '',
        confidence: 0,
        recommendation: '',
        risks: [],
        approved: false,
      }
    } finally {
      loading.value = false
    }
  }

  async function reprocessEmail (emailId: string): Promise<string> {
    if (USE_MOCK_AUTH) {
      await delay(400)
      return 'Reprocessamento enfileirado (mock).'
    }
    const result = await emailsRepository.reprocess(emailId)
    return result.message
  }

  return {
    loading,
    errorMessage,
    detail,
    workflowSteps,
    validationCards,
    comparisonFields,
    mercanteComparisonFields,
    extractedFieldMap,
    documents,
    timeline,
    risks,
    aiResult,
    fetchDetail,
    reprocessEmail,
  }
}

export { OPERATION_STATUS_LABELS }

function delay (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
