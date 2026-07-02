<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { ComparisonField } from './types'
  import { ValidationResultEnum } from '@/enums'

  interface Props {
    title: string
    sourceALabel?: string
    sourceBLabel?: string
    fields: ComparisonField[]
  }

  withDefaults(defineProps<Props>(), {
    sourceALabel: 'Invoice',
    sourceBLabel: 'DI',
  })

  function resultVariant (result: ValidationResultEnum) {
    const map: Record<ValidationResultEnum, 'success' | 'danger' | 'warning' | 'neutral'> = {
      [ValidationResultEnum.APPROVED]: 'success',
      [ValidationResultEnum.REJECTED]: 'danger',
      [ValidationResultEnum.WARNING]: 'warning',
      [ValidationResultEnum.SKIPPED]: 'neutral',
      [ValidationResultEnum.PENDING]: 'neutral',
    }
    return map[result]
  }
</script>

<template>
  <AppCard :title="title">
    <v-table
      class="comparison-card"
      density="compact"
    >
      <thead>
        <tr>
          <th>Campo</th>
          <th>{{ sourceALabel }}</th>
          <th>{{ sourceBLabel }}</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="field in fields"
          :key="field.label"
          :class="{ 'comparison-card__row--critical': field.critical }"
        >
          <td class="font-weight-medium text-body-2">
            {{ field.label }}
          </td>
          <td class="text-body-2">
            {{ field.sourceA }}
          </td>
          <td class="text-body-2">
            {{ field.sourceB }}
          </td>
          <td>
            <StatusBadge
              :label="field.result"
              :variant="resultVariant(field.result)"
              size="small"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </AppCard>
</template>

<style scoped lang="scss">
  .comparison-card {
    :deep(th) {
      font-size: 0.6875rem !important;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.7;
    }

    &__row--critical {
      background: rgba(var(--v-theme-error), 0.04);
    }
  }
</style>
