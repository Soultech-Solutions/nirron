<script lang="ts" setup>
  import { MetricCard } from '@/components/ui'

  interface ProductivityItem {
    label: string
    value: string | number
    icon: string
    color: string
    description: string
  }

  interface Props {
    items: ProductivityItem[]
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })
</script>

<template>
  <v-row>
    <v-col
      v-for="item in items"
      :key="item.label"
      cols="12"
      md="4"
    >
      <MetricCard
        :color="item.color"
        :icon="item.icon"
        :label="item.label"
        :loading="loading"
        :value="item.value"
      >
        <p class="text-caption text-medium-emphasis mt-2 mb-0">
          {{ item.description }}
        </p>
      </MetricCard>
    </v-col>
  </v-row>
</template>
