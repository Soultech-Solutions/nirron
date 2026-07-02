<script lang="ts" setup>
  import type { TimelineEvent } from './types'
  import HistoryTimeline from './HistoryTimeline.vue'

  interface Props {
    events: TimelineEvent[]
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Linha do tempo',
  })
</script>

<template>
  <HistoryTimeline
    :events="events"
    :title="title"
  />
</template>
