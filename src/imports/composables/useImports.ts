import { ref, computed } from 'vue'
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

export function useImportsList () {
  const loading = ref(false)
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
    { label: 'Todos', value: undefined },
    { label: 'Pendente', value: OperationStatus.PENDING },
    { label: 'Em conferência', value: OperationStatus.IN_CONFERENCE },
    { label: 'Em revisão', value: OperationStatus.IN_REVIEW },
    { label: 'Concluída', value: OperationStatus.COMPLETED },
    { label: 'Aprovada', value: OperationStatus.APPROVED },
    { label: 'Bloqueada', value: OperationStatus.BLOCKED },
  ])

  async function fetchList (): Promise<void> {
    loading.value = true
    try {
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
    } finally {
      loading.value = false
    }
  }

  function setSearch (value: string): void {
    query.value.search = value
    query.value.page = 1
    fetchList()
  }

  function setStatus (status?: OperationStatus): void {
    query.value.status = status
    query.value.page = 1
    fetchList()
  }

  function setPage (page: number): void {
    query.value.page = page
    fetchList()
  }

  function setSort (sortBy: string): void {
    if (query.value.sortBy === sortBy) {
      query.value.sortOrder = query.value.sortOrder === SortOrderEnum.ASC ? SortOrderEnum.DESC : SortOrderEnum.ASC
    } else {
      query.value.sortBy = sortBy
      query.value.sortOrder = SortOrderEnum.ASC
    }
    fetchList()
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

  return {
    loading,
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
  }
}

export function useImportDetail () {
  const loading = ref(false)
  const detail = ref<ImportDetailDto | null>(null)

  async function fetchDetail (id: string): Promise<void> {
    loading.value = true
    try {
      await delay(400)
      detail.value = getImportDetail(id) ?? null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    detail,
    workflowSteps: mockWorkflowSteps,
    validationCards: mockValidationCards,
    comparisonFields: mockComparisonFields,
    documents: mockDocuments,
    timeline: mockTimeline,
    risks: mockRisks,
    aiResult: mockAIResult,
    fetchDetail,
  }
}

function delay (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
