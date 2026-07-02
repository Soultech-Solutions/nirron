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
  import { AppButton, AppCard, LoadingSkeleton, PageHeader, SectionTitle } from '@/components/ui'
  import { ROUTE_PATHS } from '@/constants'
  import { RiskLevel } from '@/enums'
  import { useImportDetail } from '@/imports/composables/useImports'
  import { formatCurrency, formatNcm } from '@/utils'

  const route = useRoute()
  const router = useRouter()

  const {
    loading,
    detail,
    workflowSteps,
    validationCards,
    comparisonFields,
    documents,
    timeline,
    risks,
    aiResult,
    fetchDetail,
  } = useImportDetail()

  const sideTab = ref('observations')

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
      { label: 'Invoice', value: d.invoiceNumber, icon: 'mdi-file-document' },
      { label: 'NCM', value: formatNcm(d.ncm), icon: 'mdi-barcode' },
      { label: 'Responsável', value: d.responsible, icon: 'mdi-account' },
      { label: 'Valor FOB', value: formatCurrency(d.totalFobValue, d.currency), icon: 'mdi-currency-usd' },
    ]
  })

  const ncmData = computed(() => ({
    code: detail.value?.ncm ?? '',
    description: 'Produtos laminados planos de ferro ou aço, zincados',
    historicalCode: '72104910',
    historicalCount: 58,
    riskLevel: RiskLevel.CRITICAL,
    aiOpinion: 'Histórico consolidado indica NCM 7210.49.10 para o produto RSH30010601.',
  }))

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
        <AppButton prepend-icon="mdi-play-circle-outline">
          Executar validação
        </AppButton>
      </template>
    </PageHeader>

    <LoadingSkeleton
      :loading="loading"
      type="card"
    >
      <template v-if="detail">
        <OperationSummary
          :fields="summaryFields"
          :status="detail.registrationStatus"
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
                <ValidationCard :data="card" />
              </v-col>
            </v-row>

            <ComparisonCard
              class="mt-4"
              :fields="comparisonFields"
              title="Divergências — Invoice x DI"
            />

            <DocumentCard
              class="mt-4"
              :documents="documents"
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
                <v-tab value="ai">
                  Chat IA
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
                    />
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

                <v-tabs-window-item value="ai">
                  <div class="ai-chat-placeholder pa-4 text-center">
                    <v-icon
                      class="mb-2"
                      color="primary"
                      icon="mdi-robot-outline"
                      size="40"
                    />
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      Chat com IA NIRRON em breve. Tire dúvidas sobre esta operação.
                    </p>
                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </AppCard>
          </v-col>
        </v-row>
      </template>
    </LoadingSkeleton>
  </div>
</template>

<style scoped lang="scss">
  .ai-chat-placeholder {
    border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 10px;
    min-height: 160px;
  }
</style>
