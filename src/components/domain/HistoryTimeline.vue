<script lang="ts" setup>
  import { AppCard } from '@/components/ui'
  import type { TimelineEvent } from './types'
  import { formatDateTime } from '@/utils'

  interface Props {
    title?: string
    events: TimelineEvent[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: 'Histórico',
  })
</script>

<template>
  <AppCard :title="title">
    <v-timeline
      align="start"
      density="compact"
      side="end"
      truncate-line="both"
    >
      <v-timeline-item
        v-for="event in events"
        :key="event.id"
        :dot-color="event.color ?? 'primary'"
        size="small"
      >
        <template
          v-if="event.icon"
          #icon
        >
          <v-icon
            :icon="event.icon"
            size="14"
          />
        </template>
        <div>
          <div class="text-body-2 font-weight-semibold">
            {{ event.title }}
          </div>
          <div
            v-if="event.description"
            class="text-caption text-medium-emphasis"
          >
            {{ event.description }}
          </div>
          <div class="text-caption text-disabled mt-1">
            {{ formatDateTime(event.timestamp) }}
            <span v-if="event.user"> · {{ event.user }}</span>
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
  </AppCard>
</template>
