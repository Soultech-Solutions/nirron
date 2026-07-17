<script lang="ts" setup>
  import { AppCard, StatusBadge } from '@/components/ui'
  import type { DocumentItem } from './types'
  import { ValidationResultEnum } from '@/enums'
  import { formatDateTime } from '@/utils'

  interface Props {
    documents: DocumentItem[]
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Documentos',
  })

  const emit = defineEmits<{
    view: [id: string]
    download: [id: string]
  }>()

  const typeIcons: Record<string, string> = {
    invoice: 'mdi-file-document-outline',
    bl: 'mdi-ferry',
    ce_mercante: 'mdi-ship-wheel',
    di: 'mdi-file-certificate-outline',
    duimp: 'mdi-file-sign',
  }

  function resultVariant (status: ValidationResultEnum) {
    const map: Record<ValidationResultEnum, 'success' | 'danger' | 'warning' | 'pending'> = {
      [ValidationResultEnum.APPROVED]: 'success',
      [ValidationResultEnum.REJECTED]: 'danger',
      [ValidationResultEnum.WARNING]: 'warning',
      [ValidationResultEnum.SKIPPED]: 'pending',
      [ValidationResultEnum.PENDING]: 'pending',
    }
    return map[status]
  }
</script>

<template>
  <AppCard :title="title">
    <v-table
      class="document-card"
      density="comfortable"
      hover
    >
      <thead>
        <tr>
          <th>Documento</th>
          <th class="d-none d-md-table-cell">
            Tipo
          </th>
          <th class="d-none d-sm-table-cell">
            Tamanho
          </th>
          <th>Status</th>
          <th class="text-end">
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="doc in documents"
          :key="doc.id"
        >
          <td>
            <div class="d-flex align-center ga-2">
              <v-icon
                :icon="typeIcons[doc.type] ?? 'mdi-file-outline'"
                size="18"
              />
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ doc.name }}
                </div>
                <div class="text-caption text-disabled d-md-none">
                  {{ formatDateTime(doc.uploadedAt) }}
                </div>
              </div>
            </div>
          </td>
          <td class="d-none d-md-table-cell text-caption">
            {{ doc.type }}
          </td>
          <td class="d-none d-sm-table-cell text-caption">
            {{ doc.size }}
          </td>
          <td>
            <StatusBadge
              :label="doc.status"
              :variant="resultVariant(doc.status)"
              size="small"
            />
          </td>
          <td class="text-end">
            <v-btn
              color="primary"
              icon="mdi-eye-outline"
              size="x-small"
              title="Visualizar"
              variant="tonal"
              @click="emit('view', doc.id)"
            />
            <v-btn
              class="ms-1"
              color="primary"
              icon="mdi-download-outline"
              size="x-small"
              title="Baixar"
              variant="tonal"
              @click="emit('download', doc.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </AppCard>
</template>
