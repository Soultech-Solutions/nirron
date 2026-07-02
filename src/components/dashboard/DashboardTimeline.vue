<script lang="ts" setup>
  import { AppCard, LoadingSkeleton } from '@/components/ui'
  import { formatDateTime } from '@/utils'
  import type { DashboardTimelineItem } from '@/dashboard/types'

  interface Props {
    items: DashboardTimelineItem[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })
</script>

<template>
  <AppCard
    subtitle="Atividades recentes do sistema"
    title="Timeline"
  >
    <LoadingSkeleton
      :loading="loading"
      type="text"
    >
      <v-timeline
        align="start"
        density="compact"
        side="end"
        truncate-line="both"
      >
        <v-timeline-item
          v-for="item in items"
          :key="item.id"
          :dot-color="item.color"
          size="small"
        >
          <template #icon>
            <v-icon
              :icon="item.icon"
              size="14"
            />
          </template>

          <div class="d-flex flex-column">
            <span class="text-body-2 font-weight-semibold">
              {{ item.title }}
            </span>
            <span class="text-caption text-medium-emphasis">
              {{ item.description }}
            </span>
            <span class="text-caption text-disabled mt-1">
              {{ formatDateTime(item.timestamp) }}
            </span>
          </div>
        </v-timeline-item>
      </v-timeline>
    </LoadingSkeleton>
  </AppCard>
</template>
