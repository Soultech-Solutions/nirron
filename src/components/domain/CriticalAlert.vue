<script lang="ts" setup>
  import { AppCard, AppButton } from '@/components/ui'
  import type { CriticalAlertData } from './types'
  import { formatDateTime } from '@/utils'

  interface Props {
    alert: CriticalAlertData
    compact?: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    action: [id: string]
    dismiss: [id: string]
  }>()

  const severityConfig = {
    danger: { color: 'error', icon: 'mdi-alert-circle' },
    warning: { color: 'warning', icon: 'mdi-alert' },
    info: { color: 'info', icon: 'mdi-information' },
  } as const
</script>

<template>
  <v-alert
    :class="{ 'critical-alert--compact': compact }"
    :color="severityConfig[alert.severity].color"
    :icon="severityConfig[alert.severity].icon"
    class="critical-alert"
    variant="tonal"
  >
    <div class="d-flex align-start justify-space-between ga-3">
      <div>
        <div class="text-subtitle-2 font-weight-semibold">
          {{ alert.title }}
        </div>
        <div class="text-body-2 mt-1">
          {{ alert.message }}
        </div>
        <div class="text-caption text-medium-emphasis mt-2">
          {{ formatDateTime(alert.timestamp) }}
        </div>
      </div>
      <div
        v-if="alert.actionable"
        class="d-flex ga-1 flex-shrink-0"
      >
        <AppButton
          size="small"
          variant="secondary"
          @click="emit('action', alert.id)"
        >
          Resolver
        </AppButton>
        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="text"
          @click="emit('dismiss', alert.id)"
        />
      </div>
    </div>
  </v-alert>
</template>

<style scoped lang="scss">
  .critical-alert--compact {
    :deep(.v-alert__content) {
      padding: 4px 0;
    }
  }
</style>
