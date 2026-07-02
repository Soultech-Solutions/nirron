import { ApprovalStatusEnum, OperationStatus, RiskLevel, ValidationResultEnum, ValidationStageEnum } from '@/enums'
import type { ImportDetailDto, ImportListItemDto } from '@/dtos'
import type { PaginatedResponse } from '@/types'
import type {
  AIResultData,
  ComparisonField,
  DocumentItem,
  RiskItem,
  TimelineEvent,
  ValidationCardData,
  WorkflowStep,
} from '@/components/domain/types'

export const importsMockList: ImportListItemDto[] = [
  {
    id: 'imp-001',
    company: 'LG Electronics',
    importer: 'LG Electronics do Brasil Ltda',
    exporter: 'LG Display Co., Ltd.',
    diNumber: '25/1234567-8',
    invoiceNumber: 'INV-2026-004521',
    container: 'MRKU9208914',
    ncm: '72104910',
    responsible: 'Ana Silva',
    status: OperationStatus.IN_CONFERENCE,
    createdAt: '2026-06-28T08:00:00Z',
    updatedAt: '2026-07-01T10:32:00Z',
  },
  {
    id: 'imp-002',
    company: 'Samsung SDS',
    importer: 'Samsung SDS Latin America',
    exporter: 'Samsung Electronics',
    duimpNumber: 'DUIMP-2026-004521',
    invoiceNumber: 'INV-SAM-8821',
    container: 'TCLU3456789',
    ncm: '84713012',
    responsible: 'Carlos Mendes',
    status: OperationStatus.BLOCKED,
    createdAt: '2026-06-29T14:00:00Z',
    updatedAt: '2026-07-01T09:45:00Z',
  },
  {
    id: 'imp-003',
    company: 'Foxconn Brasil',
    importer: 'Foxconn Industrial Internet',
    exporter: 'Foxconn Technology Group',
    diNumber: '25/9876543-2',
    invoiceNumber: 'FX-INV-2026-112',
    container: 'MSKU1122334',
    ncm: '85171231',
    responsible: 'Mariana Costa',
    status: OperationStatus.PENDING,
    createdAt: '2026-07-01T07:00:00Z',
    updatedAt: '2026-07-01T07:15:00Z',
  },
  {
    id: 'imp-004',
    company: 'Positivo Tecnologia',
    importer: 'Positivo Tecnologia S.A.',
    exporter: 'Intel Corporation',
    diNumber: '25/5551234-1',
    invoiceNumber: 'INTEL-2026-334',
    ncm: '85423190',
    responsible: 'Ana Silva',
    status: OperationStatus.COMPLETED,
    createdAt: '2026-06-25T10:00:00Z',
    updatedAt: '2026-06-30T16:00:00Z',
  },
  {
    id: 'imp-005',
    company: 'Multilaser',
    importer: 'Multilaser Industrial S.A.',
    exporter: 'Shenzhen Tech Co.',
    duimpNumber: 'DUIMP-2026-004518',
    invoiceNumber: 'MLT-INV-9912',
    container: 'HLBU9988776',
    ncm: '84716052',
    responsible: 'Pedro Alves',
    status: OperationStatus.IN_REVIEW,
    createdAt: '2026-06-27T11:00:00Z',
    updatedAt: '2026-06-30T18:00:00Z',
  },
  {
    id: 'imp-006',
    company: 'WEG S.A.',
    importer: 'WEG Equipamentos Elétricos',
    exporter: 'WEG Germany GmbH',
    diNumber: '25/3344556-7',
    invoiceNumber: 'WEG-DE-2026-01',
    ncm: '85015210',
    responsible: 'Carlos Mendes',
    status: OperationStatus.APPROVED,
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-06-28T14:30:00Z',
  },
]

export function getImportDetail (id: string): ImportDetailDto | undefined {
  const item = importsMockList.find((i) => i.id === id)
  if (!item) return undefined

  return {
    ...item,
    client: item.company,
    supplier: item.exporter,
    incoterm: 'FOB',
    currency: 'USD',
    totalFobValue: 5054.16,
    currentStage: ValidationStageEnum.NCM,
    registrationStatus: item.status === OperationStatus.BLOCKED
      ? ApprovalStatusEnum.BLOCKED
      : item.status === OperationStatus.APPROVED || item.status === OperationStatus.COMPLETED
        ? ApprovalStatusEnum.AUTHORIZED
        : ApprovalStatusEnum.PENDING,
    weightNet: 4116,
    weightGross: 4194,
  }
}

export function mockImportsList (params: {
  page?: number
  perPage?: number
  search?: string
  status?: OperationStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): PaginatedResponse<ImportListItemDto> {
  let items = [...importsMockList]

  if (params.search) {
    const q = params.search.toLowerCase()
    items = items.filter((i) =>
      i.company.toLowerCase().includes(q)
      || i.invoiceNumber.toLowerCase().includes(q)
      || i.diNumber?.toLowerCase().includes(q)
      || i.duimpNumber?.toLowerCase().includes(q)
      || i.ncm.includes(q),
    )
  }

  if (params.status) {
    items = items.filter((i) => i.status === params.status)
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof ImportListItemDto
    const dir = params.sortOrder === 'desc' ? -1 : 1
    items.sort((a, b) => {
      const av = String(a[key] ?? '')
      const bv = String(b[key] ?? '')
      return av.localeCompare(bv) * dir
    })
  }

  const page = params.page ?? 1
  const perPage = params.perPage ?? 10
  const total = items.length
  const start = (page - 1) * perPage
  const data = items.slice(start, start + perPage)

  return {
    data,
    meta: {
      currentPage: page,
      perPage,
      total,
      lastPage: Math.ceil(total / perPage),
      from: total ? start + 1 : null,
      to: total ? Math.min(start + perPage, total) : null,
    },
  }
}

export const mockWorkflowSteps: WorkflowStep[] = [
  { stage: ValidationStageEnum.DOCUMENTAL, label: 'Invoice x DI', status: ValidationResultEnum.APPROVED, progress: 100 },
  { stage: ValidationStageEnum.BL, label: 'BL', status: ValidationResultEnum.APPROVED, progress: 100 },
  { stage: ValidationStageEnum.CE_MERCANTE, label: 'CE Mercante', status: ValidationResultEnum.WARNING, progress: 80 },
  { stage: ValidationStageEnum.NCM, label: 'NCM', status: ValidationResultEnum.REJECTED, progress: 60 },
  { stage: ValidationStageEnum.BENEFICIOS, label: 'Benefícios', status: ValidationResultEnum.PENDING, progress: 0 },
  { stage: ValidationStageEnum.TRIBUTACAO, label: 'Tributação', status: ValidationResultEnum.PENDING, progress: 0 },
]

export const mockValidationCards: ValidationCardData[] = [
  { title: 'Conferência Documental', stage: ValidationStageEnum.DOCUMENTAL, status: ValidationResultEnum.APPROVED, progress: 100, fieldsTotal: 24, fieldsApproved: 24, fieldsRejected: 0 },
  { title: 'Conferência BL', stage: ValidationStageEnum.BL, status: ValidationResultEnum.APPROVED, progress: 100, fieldsTotal: 12, fieldsApproved: 12, fieldsRejected: 0 },
  { title: 'CE Mercante', stage: ValidationStageEnum.CE_MERCANTE, status: ValidationResultEnum.WARNING, progress: 80, fieldsTotal: 8, fieldsApproved: 6, fieldsRejected: 0, aiSummary: 'Peso bruto com divergência Nível 2' },
  { title: 'Classificação NCM', stage: ValidationStageEnum.NCM, status: ValidationResultEnum.REJECTED, progress: 60, fieldsTotal: 6, fieldsApproved: 3, fieldsRejected: 1, aiSummary: 'NCM divergente do histórico — 58 importações anteriores' },
  { title: 'Benefícios Fiscais', stage: ValidationStageEnum.BENEFICIOS, status: ValidationResultEnum.PENDING, progress: 0, fieldsTotal: 5, fieldsApproved: 0, fieldsRejected: 0 },
  { title: 'Tributação', stage: ValidationStageEnum.TRIBUTACAO, status: ValidationResultEnum.PENDING, progress: 0, fieldsTotal: 6, fieldsApproved: 0, fieldsRejected: 0 },
]

export const mockComparisonFields: ComparisonField[] = [
  { label: 'Exportador', sourceA: 'LG Display Co., Ltd.', sourceB: 'LG Display Co., Ltd.', result: ValidationResultEnum.APPROVED },
  { label: 'Incoterm', sourceA: 'FOB', sourceB: 'FOB', result: ValidationResultEnum.APPROVED },
  { label: 'Moeda', sourceA: 'USD', sourceB: 'USD', result: ValidationResultEnum.APPROVED },
  { label: 'Quantidade', sourceA: '2.400 un', sourceB: '2.400 un', result: ValidationResultEnum.APPROVED },
  { label: 'Valor Total FOB', sourceA: 'USD 5.054,16', sourceB: 'USD 5.054,16', result: ValidationResultEnum.APPROVED },
  { label: 'NCM', sourceA: '7210.49.20', sourceB: '7210.49.10', result: ValidationResultEnum.REJECTED, critical: true },
]

export const mockDocuments: DocumentItem[] = [
  { id: 'doc-1', name: 'Invoice_COM_2026.pdf', type: 'invoice', size: '1.2 MB', uploadedAt: '2026-06-28T08:00:00Z', status: ValidationResultEnum.APPROVED },
  { id: 'doc-2', name: 'BL_PLITZ4H06418.pdf', type: 'bl', size: '890 KB', uploadedAt: '2026-06-28T08:05:00Z', status: ValidationResultEnum.APPROVED },
  { id: 'doc-3', name: 'CE_Mercante_162605.pdf', type: 'ce_mercante', size: '456 KB', uploadedAt: '2026-06-28T08:10:00Z', status: ValidationResultEnum.WARNING },
  { id: 'doc-4', name: 'DI_Rascunho.xml', type: 'di', size: '234 KB', uploadedAt: '2026-06-28T08:15:00Z', status: ValidationResultEnum.APPROVED },
]

export const mockTimeline: TimelineEvent[] = [
  { id: 't1', title: 'Operação criada', description: 'Importação iniciada por Ana Silva', timestamp: '2026-06-28T08:00:00Z', icon: 'mdi-plus-circle', color: 'primary', user: 'Ana Silva' },
  { id: 't2', title: 'Documentos enviados', description: '4 documentos carregados', timestamp: '2026-06-28T08:15:00Z', icon: 'mdi-file-upload', color: 'info' },
  { id: 't3', title: 'Etapa 1 aprovada', description: 'Conferência documental concluída', timestamp: '2026-06-29T10:00:00Z', icon: 'mdi-check-circle', color: 'success' },
  { id: 't4', title: 'Bloqueio NCM', description: 'Divergência Nível 1 identificada pela IA', timestamp: '2026-07-01T09:45:00Z', icon: 'mdi-alert-circle', color: 'error' },
]

export const mockRisks: RiskItem[] = [
  { level: RiskLevel.CRITICAL, title: 'Reenquadramento NCM', description: 'NCM proposta diverge de 58 importações históricas do produto RSH30010601', field: 'ncm' },
  { level: RiskLevel.HIGH, title: 'CE Mercante', description: 'Peso bruto com divergência de 78kg em relação à Invoice', field: 'weight_gross' },
]

export const mockAIResult: AIResultData = {
  summary: 'A operação apresenta divergência crítica na classificação NCM. O produto RSH30010601 possui histórico consolidado em 7210.49.10 com 58 importações anteriores do cliente LG.',
  confidence: 94,
  recommendation: 'Registro NÃO AUTORIZADO. Corrigir NCM para 7210.49.10 antes do prosseguimento.',
  risks: ['Reenquadramento NCM', 'Autuação fiscal', 'Bloqueio pós-registro'],
  approved: false,
}
