<script lang="ts" setup>
  import { AppCard, LoadingSkeleton, StatusBadge } from '@/components/ui'
  import { DASHBOARD_STAGE_LABELS } from '@/dashboard/types'
  import type { DashboardOperation } from '@/dashboard/types'
  import { formatDateTime } from '@/utils'

  interface Props {
    operations: DashboardOperation[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const statusMap = {
    pending: { label: 'Pendente', variant: 'pending' as const },
    in_review: { label: 'Em conferência', variant: 'info' as const },
    approved: { label: 'Aprovada', variant: 'success' as const },
    blocked: { label: 'Bloqueada', variant: 'danger' as const },
  }
</script>

<template>
  <AppCard
    subtitle="Operações processadas recentemente"
    title="Últimas Operações"
  >
    <LoadingSkeleton
      :loading="loading"
      type="table"
    >
      <v-table
        class="recent-operations"
        density="comfortable"
        hover
      >
        <thead>
          <tr>
            <th>Referência</th>
            <th class="d-none d-md-table-cell">
              Cliente
            </th>
            <th class="d-none d-sm-table-cell">
              Tipo
            </th>
            <th class="d-none d-lg-table-cell">
              Etapa
            </th>
            <th>Status</th>
            <th class="d-none d-md-table-cell text-end">
              Atualizado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="op in operations"
            :key="op.id"
          >
            <td class="font-weight-medium text-body-2">
              {{ op.reference }}
            </td>
            <td class="d-none d-md-table-cell text-body-2">
              {{ op.client }}
            </td>
            <td class="d-none d-sm-table-cell">
              <StatusBadge
                :label="op.documentType"
                size="small"
                variant="neutral"
              />
            </td>
            <td class="d-none d-lg-table-cell text-caption text-medium-emphasis">
              {{ DASHBOARD_STAGE_LABELS[op.stage] }}
            </td>
            <td>
              <StatusBadge
                :label="statusMap[op.status].label"
                :variant="statusMap[op.status].variant"
                dot
                size="small"
              />
            </td>
            <td class="d-none d-md-table-cell text-end text-caption text-medium-emphasis">
              {{ op.updatedAt ? formatDateTime(op.updatedAt) : '—' }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </LoadingSkeleton>
  </AppCard>
</template>

<style scoped lang="scss">
  .recent-operations {
    :deep(th) {
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: rgba(var(--v-theme-on-surface), 0.6) !important;
    }
  }
</style>
