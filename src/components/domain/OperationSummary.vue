<script lang="ts" setup>
  import { computed } from 'vue'
  import { StatusBadge } from '@/components/ui'
  import type { OperationSummaryField } from './types'
  import { OperationStatus } from '@/enums'
  import { OPERATION_STATUS_LABELS } from '@/imports/processStatus'

  interface Props {
    fields: OperationSummaryField[]
    status: string
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Resumo da Operação',
  })

  function statusVariant (status: string) {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'neutral'> = {
      [OperationStatus.PENDING]: 'pending',
      [OperationStatus.IN_REVIEW]: 'info',
      [OperationStatus.IN_CONFERENCE]: 'info',
      [OperationStatus.COMPLETED]: 'success',
      [OperationStatus.APPROVED]: 'success',
      [OperationStatus.BLOCKED]: 'danger',
      [OperationStatus.CANCELLED]: 'neutral',
      authorized: 'success',
      not_authorized: 'danger',
    }
    return map[status] ?? 'pending'
  }

  const statusLabel = computed(() => {
    if (props.status in OPERATION_STATUS_LABELS) {
      return OPERATION_STATUS_LABELS[props.status as OperationStatus]
    }
    const registrationLabels: Record<string, string> = {
      authorized: 'Autorizado',
      not_authorized: 'Não Autorizado',
      blocked: 'Bloqueado',
      pending: 'Pendente',
    }
    return registrationLabels[props.status] ?? props.status
  })
</script>

<template>
  <v-card
    class="operation-summary pa-5"
    rounded="lg"
    variant="outlined"
  >
    <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-4">
      <h2 class="text-h6 font-weight-bold">
        {{ title }}
      </h2>
      <StatusBadge
        :label="statusLabel"
        :variant="statusVariant(status)"
        dot
      />
    </div>

    <v-row>
      <v-col
        v-for="field in fields"
        :key="field.label"
        cols="12"
        lg="2"
        md="3"
        sm="4"
      >
        <div class="operation-summary__field">
          <div class="d-flex align-center ga-1 mb-1">
            <v-icon
              v-if="field.icon"
              :icon="field.icon"
              color="primary"
              size="16"
            />
            <span class="text-caption text-medium-emphasis font-weight-medium">
              {{ field.label }}
            </span>
          </div>
          <div class="text-body-2 font-weight-semibold text-truncate">
            {{ field.value || '—' }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss">
  .operation-summary {
    background: rgb(var(--v-theme-surface));

    &__field {
      padding: 8px 0;
    }
  }
</style>
