<script lang="ts" setup>
  import { computed } from 'vue'
  import type { MetricTrend } from './types'

  interface Props {
    label: string
    value: string | number
    icon?: string
    trend?: MetricTrend
    trendValue?: string
    color?: string
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    loading: false,
  })

  const trendIcon = computed(() => {
    const icons: Record<MetricTrend, string> = {
      up: 'mdi-trending-up',
      down: 'mdi-trending-down',
      stable: 'mdi-minus',
    }
    return props.trend ? icons[props.trend] : undefined
  })

  const trendColor = computed(() => {
    if (!props.trend) return undefined
    const colors: Record<MetricTrend, string> = {
      up: 'success',
      down: 'error',
      stable: 'secondary',
    }
    return colors[props.trend]
  })
</script>

<template>
  <v-card
    class="metric-card"
    rounded="lg"
    variant="outlined"
  >
    <v-card-text class="pa-5">
      <div class="d-flex align-start justify-space-between mb-3">
        <span class="metric-card__label text-body-2 text-medium-emphasis">
          {{ label }}
        </span>
        <v-avatar
          v-if="icon"
          :color="color"
          size="36"
          variant="tonal"
        >
          <v-icon
            :icon="icon"
            size="18"
          />
        </v-avatar>
      </div>

      <v-skeleton-loader
        v-if="loading"
        type="text"
        width="80"
      />
      <div
        v-else
        class="metric-card__value text-h4 font-weight-bold"
      >
        {{ value }}
      </div>

      <div
        v-if="trend && trendValue && !loading"
        class="d-flex align-center ga-1 mt-2"
      >
        <v-icon
          :color="trendColor"
          :icon="trendIcon"
          size="16"
        />
        <span
          :class="`text-${trendColor}`"
          class="text-caption font-weight-medium"
        >
          {{ trendValue }}
        </span>
        <span class="text-caption text-medium-emphasis">
          vs. ontem
        </span>
      </div>

      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
  .metric-card {
    height: 100%;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
    }

    :global(.v-theme--dark) &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
    }

    &__label {
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    &__value {
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
  }
</style>
