<script lang="ts" setup>
  import { computed } from 'vue'
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { AIResultData } from './types'

  interface Props {
    data: AIResultData
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Parecer da IA',
  })

  const confidenceColor = computed(() => {
    if (props.data.confidence >= 90) return 'success'
    if (props.data.confidence >= 70) return 'warning'
    return 'error'
  })
</script>

<template>
  <AppCard :title="title">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center ga-2">
        <v-avatar
          color="primary"
          size="40"
          variant="tonal"
        >
          <v-icon icon="mdi-robot-outline" />
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-semibold">
            NIRRON AI
          </div>
          <div class="text-caption text-medium-emphasis">
            Confiança: {{ data.confidence }}%
          </div>
        </div>
      </div>
      <StatusBadge
        :label="data.approved ? 'Favorável' : 'Desfavorável'"
        :variant="data.approved ? 'success' : 'danger'"
        dot
      />
    </div>

    <v-progress-linear
      :color="confidenceColor"
      :model-value="data.confidence"
      class="mb-4"
      height="6"
      rounded
    />

    <p class="text-body-2 mb-3">
      {{ data.summary }}
    </p>

    <v-alert
      :type="data.approved ? 'success' : 'warning'"
      class="mb-3"
      density="compact"
      variant="tonal"
    >
      {{ data.recommendation }}
    </v-alert>

    <div v-if="data.risks.length">
      <div class="text-caption font-weight-semibold text-medium-emphasis mb-2">
        Riscos identificados
      </div>
      <v-chip
        v-for="(risk, i) in data.risks"
        :key="i"
        class="me-1 mb-1"
        color="warning"
        label
        size="small"
        variant="tonal"
      >
        {{ risk }}
      </v-chip>
    </div>
  </AppCard>
</template>
