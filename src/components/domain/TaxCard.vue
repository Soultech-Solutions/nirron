<script lang="ts" setup>
  import { AppCard } from '@/components/ui'
  import { formatCurrency } from '@/utils'
  import type { TaxItem } from './types'

  interface Props {
    items: TaxItem[]
    title?: string
    total?: number
    currency?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Recálculo Tributário',
    currency: 'BRL',
  })
</script>

<template>
  <AppCard :title="title">
    <v-table
      class="tax-card"
      density="compact"
    >
      <thead>
        <tr>
          <th>Imposto</th>
          <th>Alíquota</th>
          <th>Base</th>
          <th class="text-end">
            Valor
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.label"
        >
          <td class="font-weight-medium">
            {{ item.label }}
          </td>
          <td>{{ item.rate }}</td>
          <td>{{ item.base }}</td>
          <td class="text-end font-weight-medium">
            {{ item.value }}
          </td>
        </tr>
      </tbody>
      <tfoot v-if="total !== undefined">
        <tr>
          <td
            class="font-weight-bold"
            colspan="3"
          >
            Total
          </td>
          <td class="text-end font-weight-bold">
            {{ formatCurrency(total, currency) }}
          </td>
        </tr>
      </tfoot>
    </v-table>
  </AppCard>
</template>

<style scoped lang="scss">
  .tax-card :deep(th) {
    font-size: 0.6875rem !important;
    text-transform: uppercase;
    opacity: 0.7;
  }
</style>
