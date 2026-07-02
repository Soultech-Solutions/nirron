<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { ImportCardData } from './types'
  import { OperationStatus } from '@/enums'
  import { formatDateTime } from '@/utils'

  interface Props {
    data: ImportCardData
  }

  defineProps<Props>()

  const emit = defineEmits<{
    click: []
  }>()

  function statusVariant (status: OperationStatus) {
    const map: Record<OperationStatus, 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'neutral'> = {
      [OperationStatus.PENDING]: 'pending',
      [OperationStatus.IN_REVIEW]: 'info',
      [OperationStatus.IN_CONFERENCE]: 'info',
      [OperationStatus.COMPLETED]: 'success',
      [OperationStatus.APPROVED]: 'success',
      [OperationStatus.BLOCKED]: 'danger',
      [OperationStatus.CANCELLED]: 'neutral',
    }
    return map[status]
  }
</script>

<template>
  <AppCard
    class="import-card"
    hoverable
    @click="emit('click')"
  >
    <div class="d-flex align-start justify-space-between">
      <div>
        <div class="text-subtitle-2 font-weight-semibold">
          {{ data.reference }}
        </div>
        <div class="text-caption text-medium-emphasis mt-1">
          {{ data.company }}
        </div>
        <div class="text-caption text-medium-emphasis">
          NCM {{ data.ncm }}
        </div>
      </div>
      <StatusBadge
        :label="data.status"
        :variant="statusVariant(data.status)"
        dot
        size="small"
      />
    </div>
    <div class="text-caption text-disabled mt-3">
      {{ formatDateTime(data.updatedAt) }}
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
  .import-card {
    cursor: pointer;
  }
</style>
