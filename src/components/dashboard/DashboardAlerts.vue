<script lang="ts" setup>
  import { AppCard, LoadingSkeleton, StatusBadge } from '@/components/ui'
  import type { DashboardAlert } from '@/dashboard/types'
  import { formatDateTime } from '@/utils'

  interface Props {
    alerts: DashboardAlert[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const severityMap = {
    danger: 'danger' as const,
    warning: 'warning' as const,
    info: 'info' as const,
  }

  const iconMap = {
    danger: 'mdi-alert-circle-outline',
    warning: 'mdi-alert-outline',
    info: 'mdi-information-outline',
  }
</script>

<template>
  <AppCard
    subtitle="Alertas que requerem atenção"
    title="Alertas"
  >
    <LoadingSkeleton
      :loading="loading"
      type="text"
    >
      <v-list
        v-if="alerts.length"
        class="pa-0"
        lines="two"
      >
        <v-list-item
          v-for="alert in alerts"
          :key="alert.id"
          class="dashboard-alert px-0"
          rounded="lg"
        >
          <template #prepend>
            <v-avatar
              :color="severityMap[alert.severity]"
              size="36"
              variant="tonal"
            >
              <v-icon
                :icon="iconMap[alert.severity]"
                size="18"
              />
            </v-avatar>
          </template>

          <v-list-item-title class="text-body-2 font-weight-semibold">
            {{ alert.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ alert.message }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex flex-column align-end ga-1">
              <StatusBadge
                :label="alert.severity === 'danger' ? 'Crítico' : alert.severity === 'warning' ? 'Atenção' : 'Info'"
                :variant="severityMap[alert.severity]"
                size="small"
              />
              <span
                v-if="alert.timestamp"
                class="text-caption text-disabled"
              >
                {{ formatDateTime(alert.timestamp) }}
              </span>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <div
        v-else
        class="text-center text-medium-emphasis text-body-2 py-6"
      >
        Nenhum alerta no momento
      </div>
    </LoadingSkeleton>
  </AppCard>
</template>

<style scoped lang="scss">
  .dashboard-alert {
    border-bottom: 1px solid rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.5));

    &:last-child {
      border-bottom: none;
    }
  }
</style>
