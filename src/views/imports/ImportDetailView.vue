<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    AIResultCard,
    ComparisonCard,
    DocumentCard,
    HistoryTimeline,
    NCMCard,
    OperationSummary,
    RiskCard,
    ValidationCard,
    WorkflowStepper,
  } from '@/components/domain'
  import type { DocumentItem } from '@/components/domain/types'
  import { AppButton, AppCard, AppDialog, ConfirmDialog, LoadingSkeleton, PageHeader, SectionTitle } from '@/components/ui'
  import { useNotification } from '@/composables'
  import { ROUTE_PATHS } from '@/constants'
  import { RiskLevel } from '@/enums'
  import { useImportDetail } from '@/imports/composables/useImports'
  import {
    applyMercanteCrossCheckToCards,
    crossCheckMercanteWithExtracted,
    downloadFile,
    downloadFromBlob,
    mercanteCrossCheckRisks,
    validateMercanteCe,
  } from '@/services'
  import { formatCurrency, formatNcm, getErrorMessage } from '@/utils'

  const route = useRoute()
  const router = useRouter()
  const { success, error, warning } = useNotification()

  const {
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
  } = useImportDetail()

  const sideTab = ref('observations')
  const viewerOpen = ref(false)
  const viewerDoc = ref<DocumentItem | null>(null)
  const actionLoading = ref(false)
  const mercanteLoading = ref(false)
  const reprocessLoading = ref(false)
  const reprocessConfirmOpen = ref(false)

  watch(
    () => route.params.id as string,
    (newId) => { if (newId) fetchDetail(newId) },
    { immediate: true },
  )

  const summaryFields = computed(() => {
    if (!detail.value) return []
    const d = detail.value
    return [
      { label: 'Empresa', value: d.company, icon: 'mdi-domain' },
      { label: 'Cliente', value: d.client, icon: 'mdi-account-tie' },
      { label: 'Fornecedor', value: d.supplier, icon: 'mdi-truck' },
      { label: 'Incoterm', value: d.incoterm, icon: 'mdi-handshake-outline' },
      { label: 'Container', value: d.container ?? '—', icon: 'mdi-package-variant' },
      { label: 'DI', value: d.diNumber ?? '—', icon: 'mdi-file-certificate' },
      { label: 'DUIMP', value: d.duimpNumber ?? '—', icon: 'mdi-file-sign' },
      { label: 'BL', value: d.blNumber ?? '—', icon: 'mdi-ferry' },
      { label: 'CE Mercante', value: d.ceNumber ?? '—', icon: 'mdi-ship-wheel' },
      { label: 'Invoice', value: d.invoiceNumber, icon: 'mdi-file-document' },
      { label: 'Assunto', value: d.emailSubject ?? '—', icon: 'mdi-email-outline' },
      { label: 'NCM', value: formatNcm(d.ncm), icon: 'mdi-barcode' },
      { label: 'Valor FOB', value: formatCurrency(d.totalFobValue, d.currency), icon: 'mdi-currency-usd' },
    ]
  })

  const canReprocess = computed(() => Boolean(detail.value?.emailId))

  async function handleReprocess (): Promise<void> {
    const emailId = detail.value?.emailId
    if (!emailId) {
      warning('Sem Email ID', 'Esta importação não está vinculada a um e-mail do miner.')
      return
    }

    reprocessConfirmOpen.value = false
    reprocessLoading.value = true
    try {
      const message = await reprocessEmail(emailId)
      success('Reprocessamento enfileirado', message)
    } catch (error_) {
      error('Falha ao reprocessar', getErrorMessage(error_))
    } finally {
      reprocessLoading.value = false
    }
  }

  const ncmData = computed(() => ({
    code: detail.value?.ncm && detail.value.ncm !== '—' ? detail.value.ncm : '',
    description: detail.value?.ncm && detail.value.ncm !== '—'
      ? 'NCM informado nos campos extraídos do processo'
      : 'NCM não identificado nos campos do processo',
    historicalCode: undefined as string | undefined,
    historicalCount: undefined as number | undefined,
    riskLevel: risks.value.some((r) => r.level === RiskLevel.CRITICAL)
      ? RiskLevel.CRITICAL
      : risks.value.some((r) => r.level === RiskLevel.HIGH)
        ? RiskLevel.HIGH
        : RiskLevel.LOW,
    aiOpinion: aiResult.value.recommendation || undefined,
  }))

  async function handleValidateMercante (): Promise<void> {
    const ceNumber = detail.value?.ceNumber?.trim()
    if (!ceNumber) {
      warning(
        'CE Mercante não encontrado',
        'Informe ou extraia o número CE nos documentos para consultar o Mercante.',
      )
      return
    }

    mercanteLoading.value = true
    try {
      const data = await validateMercanteCe({ ce_number: ceNumber, save: true })
      const crossCheck = crossCheckMercanteWithExtracted(data, extractedFieldMap.value)

      mercanteComparisonFields.value = crossCheck.fields
      validationCards.value = applyMercanteCrossCheckToCards(validationCards.value, crossCheck)

      const mercanteRisks = mercanteCrossCheckRisks(crossCheck)
      risks.value = [
        ...risks.value.filter((r) => !r.title.startsWith('Mercante —')),
        ...mercanteRisks,
      ]

      if (crossCheck.rejected > 0) {
        warning('Cruzamento Mercante', crossCheck.summary)
      } else {
        success('Consulta Mercante concluída', crossCheck.summary)
      }
    } catch (error_) {
      error('Falha na consulta Mercante', getErrorMessage(error_))
    } finally {
      mercanteLoading.value = false
    }
  }

  function findDocument (id: string): DocumentItem | undefined {
    return documents.value.find((doc) => doc.id === id)
  }

  function handleViewDocument (id: string): void {
    const doc = findDocument(id)
    if (!doc) {
      warning('Documento não encontrado')
      return
    }
    if (!doc.content && !doc.downloadUrl) {
      warning('Sem conteúdo', 'Este documento não possui preview disponível.')
      return
    }
    viewerDoc.value = doc
    viewerOpen.value = true
  }

  async function handleDownloadDocument (id: string): Promise<void> {
    const doc = findDocument(id)
    if (!doc) {
      warning('Documento não encontrado')
      return
    }

    actionLoading.value = true
    try {
      if (doc.downloadUrl) {
        await downloadFile(doc.downloadUrl, {
          fileName: doc.name,
          mimeType: doc.mimeType,
        })
        success('Download iniciado', doc.name)
        return
      }

      if (doc.content) {
        const blob = new Blob([doc.content], {
          type: doc.mimeType ?? 'text/markdown;charset=utf-8',
        })
        await downloadFromBlob(blob, doc.name.endsWith('.md') ? doc.name : `${doc.name}.md`)
        success('Arquivo baixado', doc.name)
        return
      }

      warning('Download indisponível', 'Não há arquivo ou conteúdo associado a este documento.')
    } catch (error_) {
      error('Falha no download', getErrorMessage(error_))
    } finally {
      actionLoading.value = false
    }
  }
</script>

<template>
  <div class="import-detail">
    <PageHeader
      :title="detail?.company ?? 'Carregando...'"
      subtitle="Detalhes da operação de importação"
    >
      <template #actions>
        <AppButton
          prepend-icon="mdi-arrow-left"
          variant="ghost"
          @click="router.push(ROUTE_PATHS.IMPORTS)"
        >
          Voltar
        </AppButton>
        <AppButton
          v-if="canReprocess"
          :loading="reprocessLoading"
          prepend-icon="mdi-refresh"
          variant="secondary"
          @click="reprocessConfirmOpen = true"
        >
          Reprocessar docs
        </AppButton>
      </template>
    </PageHeader>

    <v-alert
      v-if="errorMessage"
      class="mb-4"
      density="compact"
      type="error"
      variant="tonal"
    >
      {{ errorMessage }}
    </v-alert>

    <LoadingSkeleton
      :loading="loading"
      type="card"
    >
      <template v-if="detail">
        <OperationSummary
          :fields="summaryFields"
          :status="detail.status"
          class="mb-6"
        />

        <AppCard
          class="mb-6"
          subtitle="Progresso das 6 etapas de conferência"
          title="Workflow de Conferência"
        >
          <WorkflowStepper
            :current-stage="detail.currentStage"
            :steps="workflowSteps"
            clickable
          />
        </AppCard>

        <v-row class="mb-6">
          <v-col
            cols="12"
            lg="8"
          >
            <SectionTitle
              subtitle="Resultado de cada etapa"
              title="Validações"
            />
            <v-row>
              <v-col
                v-for="card in validationCards"
                :key="card.stage"
                cols="12"
                md="6"
              >
                <ValidationCard
                  :action-loading="mercanteLoading"
                  :data="card"
                  @validate-mercante="handleValidateMercante"
                />
              </v-col>
            </v-row>

            <ComparisonCard
              v-if="mercanteComparisonFields.length"
              class="mt-4"
              :fields="mercanteComparisonFields"
              source-a-label="Mercante"
              source-b-label="Extração (e-mail)"
              title="Cruzamento Mercante × Extração"
            />

            <ComparisonCard
              class="mt-4"
              :fields="comparisonFields"
              source-a-label="Origem A"
              source-b-label="Origem B"
              title="Cruzamentos por regra (PDF)"
            />

            <DocumentCard
              class="mt-4"
              :documents="documents"
              @download="handleDownloadDocument"
              @view="handleViewDocument"
            />

            <AIResultCard
              class="mt-4"
              :data="aiResult"
            />

            <HistoryTimeline
              class="mt-4"
              :events="timeline"
              title="Histórico da operação"
            />
          </v-col>

          <v-col
            cols="12"
            lg="4"
          >
            <NCMCard
              class="mb-4"
              :data="ncmData"
            />

            <RiskCard
              class="mb-4"
              :risks="risks"
            />

            <AppCard title="Painel lateral">
              <v-tabs
                v-model="sideTab"
                color="primary"
                density="compact"
              >
                <v-tab value="observations">
                  Observações
                </v-tab>
                <v-tab value="files">
                  Arquivos
                </v-tab>
                <v-tab value="logs">
                  Logs
                </v-tab>
              </v-tabs>

              <v-tabs-window
                v-model="sideTab"
                class="mt-4"
              >
                <v-tabs-window-item value="observations">
                  <v-textarea
                    label="Observações"
                    placeholder="Adicione observações sobre esta operação..."
                    rows="4"
                    variant="outlined"
                  />
                </v-tabs-window-item>

                <v-tabs-window-item value="files">
                  <v-list density="compact">
                    <v-list-item
                      v-for="doc in documents"
                      :key="doc.id"
                      :subtitle="doc.size"
                      :title="doc.name"
                      prepend-icon="mdi-file-outline"
                    >
                      <template #append>
                        <v-btn
                          color="primary"
                          icon="mdi-eye-outline"
                          size="x-small"
                          variant="tonal"
                          @click="handleViewDocument(doc.id)"
                        />
                        <v-btn
                          :loading="actionLoading"
                          class="ms-1"
                          color="primary"
                          icon="mdi-download-outline"
                          size="x-small"
                          variant="tonal"
                          @click="handleDownloadDocument(doc.id)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-tabs-window-item>

                <v-tabs-window-item value="logs">
                  <v-list density="compact">
                    <v-list-item
                      v-for="event in timeline"
                      :key="event.id"
                      :subtitle="event.description"
                      :title="event.title"
                    />
                  </v-list>
                </v-tabs-window-item>
              </v-tabs-window>
            </AppCard>
          </v-col>
        </v-row>
      </template>
    </LoadingSkeleton>

    <AppDialog
      v-model="viewerOpen"
      :title="viewerDoc?.name ?? 'Documento'"
      max-width="840"
      scrollable
    >
      <iframe
        v-if="viewerDoc?.downloadUrl"
        :src="viewerDoc.downloadUrl"
        class="document-preview__frame"
        title="Visualização do documento"
      />
      <div
        v-else-if="viewerDoc?.content"
        class="document-preview"
      >
        <pre class="document-preview__markdown">{{ viewerDoc.content }}</pre>
      </div>
      <p
        v-else
        class="text-body-2 text-medium-emphasis mb-0"
      >
        Conteúdo indisponível para visualização.
      </p>

      <template #actions>
        <AppButton
          variant="ghost"
          @click="viewerOpen = false"
        >
          Fechar
        </AppButton>
        <AppButton
          v-if="viewerDoc"
          :loading="actionLoading"
          prepend-icon="mdi-download-outline"
          @click="viewerDoc && handleDownloadDocument(viewerDoc.id)"
        >
          Baixar
        </AppButton>
      </template>
    </AppDialog>

    <ConfirmDialog
      v-model="reprocessConfirmOpen"
      confirm-label="Reprocessar"
      message="O e-mail será marcado como pending. O miner reextrairá os documentos com falha no próximo ciclo."
      title="Reprocessar documentos?"
      :loading="reprocessLoading"
      @confirm="handleReprocess"
    />
  </div>
</template>

<style scoped lang="scss">
  .document-preview {
    &__markdown {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.5;
      max-height: 60vh;
      overflow: auto;
      padding: 12px;
      border-radius: 8px;
      background: rgba(var(--v-theme-on-surface), 0.04);
    }

    &__frame {
      width: 100%;
      height: 60vh;
      border: none;
      border-radius: 8px;
    }
  }
</style>
