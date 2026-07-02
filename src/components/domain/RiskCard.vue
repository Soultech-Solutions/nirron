<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { RiskItem } from './types'
  import { RiskLevel } from '@/enums'

  interface Props {
    risks: RiskItem[]
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Riscos identificados',
  })

  function riskVariant (level: RiskLevel) {
    const map: Record<RiskLevel, 'success' | 'warning' | 'danger' | 'info'> = {
      [RiskLevel.LOW]: 'success',
      [RiskLevel.MEDIUM]: 'warning',
      [RiskLevel.HIGH]: 'danger',
      [RiskLevel.CRITICAL]: 'danger',
    }
    return map[level]
  }

  function riskLabel (level: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      [RiskLevel.LOW]: 'Baixo',
      [RiskLevel.MEDIUM]: 'Médio',
      [RiskLevel.HIGH]: 'Alto',
      [RiskLevel.CRITICAL]: 'Crítico',
    }
    return map[level]
  }
</script>

<template>
  <AppCard :title="title">
    <v-list
      class="pa-0"
      lines="two"
    >
      <v-list-item
        v-for="(risk, index) in risks"
        :key="`${risk.title}-${index}`"
        class="px-0"
      >
        <template #prepend>
          <v-icon
            :color="riskVariant(risk.level)"
            icon="mdi-alert-outline"
          />
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ risk.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ risk.description }}
        </v-list-item-subtitle>
        <template #append>
          <StatusBadge
            :label="riskLabel(risk.level)"
            :variant="riskVariant(risk.level)"
            size="small"
          />
        </template>
      </v-list-item>
    </v-list>
  </AppCard>
</template>
