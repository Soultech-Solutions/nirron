<script lang="ts" setup>
  import { AppCard, LoadingSkeleton } from '@/components/ui'
  import type { StageStatusItem } from '@/dashboard/types'

  interface Props {
    stages: StageStatusItem[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })
</script>

<template>
  <AppCard
    subtitle="Progresso das operações por etapa de conferência"
    title="Status por Etapa"
  >
    <LoadingSkeleton
      :loading="loading"
      type="text"
    >
      <div class="stage-status d-flex flex-column ga-4">
        <div
          v-for="stage in stages"
          :key="stage.stage"
          class="stage-status__item"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2 font-weight-medium">{{ stage.label }}</span>
            <span class="text-caption text-medium-emphasis">
              {{ stage.count }} ops · {{ stage.percentage }}%
            </span>
          </div>
          <v-progress-linear
            :color="stage.color"
            :model-value="stage.percentage"
            height="8"
            rounded
          />
        </div>
      </div>
    </LoadingSkeleton>
  </AppCard>
</template>

<style scoped lang="scss">
  .stage-status__item {
    :deep(.v-progress-linear) {
      background: rgba(var(--v-border-color), 0.3);
    }
  }
</style>
