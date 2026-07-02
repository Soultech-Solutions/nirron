<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { NCMData } from './types'
  import { RiskLevel } from '@/enums'
  import { formatNcm } from '@/utils'

  interface Props {
    data: NCMData
  }

  defineProps<Props>()

  function riskVariant (level: RiskLevel) {
    const map: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
      [RiskLevel.LOW]: 'success',
      [RiskLevel.MEDIUM]: 'warning',
      [RiskLevel.HIGH]: 'danger',
      [RiskLevel.CRITICAL]: 'danger',
    }
    return map[level]
  }
</script>

<template>
  <AppCard title="Classificação Fiscal NCM">
    <div class="d-flex align-start justify-space-between mb-4">
      <div>
        <div class="text-h6 font-weight-bold">
          {{ formatNcm(data.code) }}
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ data.description }}
        </div>
      </div>
      <StatusBadge
        :label="data.riskLevel"
        :variant="riskVariant(data.riskLevel)"
        dot
      />
    </div>

    <v-alert
      v-if="data.historicalCode"
      class="mb-3"
      density="compact"
      type="info"
      variant="tonal"
    >
      Histórico: {{ formatNcm(data.historicalCode) }} — {{ data.historicalCount }} importações anteriores
    </v-alert>

    <p
      v-if="data.aiOpinion"
      class="text-body-2 text-medium-emphasis mb-0"
    >
      <v-icon
        class="me-1"
        icon="mdi-robot-outline"
        size="16"
      />
      {{ data.aiOpinion }}
    </p>
  </AppCard>
</template>
