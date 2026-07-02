<script lang="ts" setup>
  import { MetricCard } from '@/components/ui'
  import type { DashboardKpi } from '@/dashboard/types'

  interface Props {
    items: DashboardKpi[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })
</script>

<template>
  <v-row>
    <v-col
      v-for="kpi in items"
      :key="kpi.key"
      cols="12"
      lg="2"
      md="4"
      sm="6"
    >
      <MetricCard
        :color="kpi.color"
        :icon="kpi.icon"
        :label="kpi.label"
        :loading="loading"
        :trend="kpi.trend"
        :trend-value="kpi.trendValue"
        :value="kpi.value"
      />
    </v-col>
  </v-row>
</template>
