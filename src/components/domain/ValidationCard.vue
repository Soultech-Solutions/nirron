<script lang="ts" setup>
  import { AppCard, SectionTitle, StatusBadge } from '@/components/ui'
  import type { ValidationCardData } from './types'
  import { ValidationResultEnum } from '@/enums'

  interface Props {
    data: ValidationCardData
    loading?: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    click: []
  }>()

  function statusVariant (status: ValidationResultEnum) {
    const map: Record<ValidationResultEnum, 'success' | 'danger' | 'warning' | 'pending' | 'neutral'> = {
      [ValidationResultEnum.APPROVED]: 'success',
      [ValidationResultEnum.REJECTED]: 'danger',
      [ValidationResultEnum.WARNING]: 'warning',
      [ValidationResultEnum.SKIPPED]: 'neutral',
      [ValidationResultEnum.PENDING]: 'pending',
    }
    return map[status]
  }
</script>

<template>
  <AppCard
    class="validation-card"
    hoverable
    @click="emit('click')"
  >
    <div class="d-flex align-start justify-space-between mb-3">
      <div>
        <SectionTitle :title="data.title" />
      </div>
      <StatusBadge
        :label="data.status"
        :variant="statusVariant(data.status)"
        dot
      />
    </div>

    <v-progress-linear
      :model-value="data.progress"
      class="mb-3"
      color="primary"
      height="6"
      rounded
    />

    <div class="d-flex ga-4 text-caption text-medium-emphasis">
      <span>{{ data.fieldsApproved }}/{{ data.fieldsTotal }} aprovados</span>
      <span
        v-if="data.fieldsRejected"
        class="text-error"
      >{{ data.fieldsRejected }} rejeitados</span>
    </div>

    <p
      v-if="data.aiSummary"
      class="text-caption text-medium-emphasis mt-3 mb-0"
    >
      {{ data.aiSummary }}
    </p>
  </AppCard>
</template>

<style scoped lang="scss">
  .validation-card {
    cursor: pointer;
  }
</style>
