<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { BenefitItem } from './types'
  import { formatDate } from '@/utils'

  interface Props {
    benefits: BenefitItem[]
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Benefícios Fiscais',
  })
</script>

<template>
  <AppCard :title="title">
    <v-list
      class="pa-0"
      lines="two"
    >
      <v-list-item
        v-for="benefit in benefits"
        :key="benefit.type"
        class="px-0"
      >
        <template #prepend>
          <v-icon
            :color="benefit.valid ? 'success' : 'error'"
            :icon="benefit.applied ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
          />
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ benefit.label }}
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="benefit.expiresAt"
          class="text-caption"
        >
          Vigência até {{ formatDate(benefit.expiresAt) }}
        </v-list-item-subtitle>
        <template #append>
          <StatusBadge
            :label="benefit.valid ? 'Válido' : 'Inválido'"
            :variant="benefit.valid ? 'success' : 'danger'"
            size="small"
          />
        </template>
      </v-list-item>
    </v-list>
  </AppCard>
</template>
