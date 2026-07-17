<script lang="ts" setup>
  import { computed } from 'vue'
  import { AppCard, LoadingSkeleton } from '@/components/ui'
  import type { MonthlyChartPoint } from '@/dashboard/types'

  interface Props {
    data: MonthlyChartPoint[]
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const maxValue = computed(() => {
    return Math.max(...props.data.map((d) => d.total), 1)
  })

  function barHeight (value: number): string {
    return `${(value / maxValue.value) * 100}%`
  }
</script>

<template>
  <AppCard
    subtitle="Total de importações processadas por mês"
    title="Importações Mensais"
  >
    <LoadingSkeleton
      :loading="loading"
      type="chart"
    >
      <div class="monthly-chart">
        <div class="monthly-chart__bars d-flex align-end justify-space-between ga-2">
          <div
            v-for="point in data"
            :key="point.month"
            class="monthly-chart__group d-flex flex-column align-center flex-grow-1"
          >
            <div class="monthly-chart__bar-stack d-flex align-end ga-1">
              <div
                :style="{ height: barHeight(point.approved) }"
                class="monthly-chart__bar monthly-chart__bar--approved"
                :title="`Aprovadas: ${point.approved}`"
              />
              <div
                :style="{ height: barHeight(point.blocked) }"
                class="monthly-chart__bar monthly-chart__bar--blocked"
                :title="`Bloqueadas: ${point.blocked}`"
              />
            </div>
            <span class="monthly-chart__label text-caption text-medium-emphasis mt-2">
              {{ point.month }}
            </span>
          </div>
        </div>

        <div class="monthly-chart__legend d-flex ga-4 mt-4">
          <div class="d-flex align-center ga-2">
            <span class="monthly-chart__dot monthly-chart__dot--approved" />
            <span class="text-caption">Aprovadas</span>
          </div>
          <div class="d-flex align-center ga-2">
            <span class="monthly-chart__dot monthly-chart__dot--blocked" />
            <span class="text-caption">Bloqueadas</span>
          </div>
        </div>
      </div>
    </LoadingSkeleton>
  </AppCard>
</template>

<style scoped lang="scss">
  .monthly-chart {
    &__bars {
      height: 200px;
      padding-top: 8px;
    }

    &__bar-stack {
      height: 160px;
      width: 100%;
      max-width: 48px;
    }

    &__bar {
      width: 12px;
      min-height: 4px;
      border-radius: 4px 4px 0 0;
      transition: height 0.4s ease;

      &--approved {
        background: rgb(var(--v-theme-success));
      }

      &--blocked {
        background: rgb(var(--v-theme-error));
      }
    }

    &__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &--approved {
        background: rgb(var(--v-theme-success));
      }

      &--blocked {
        background: rgb(var(--v-theme-error));
      }
    }
  }
</style>
